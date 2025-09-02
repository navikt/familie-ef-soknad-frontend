import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const TOKENX_BASE_URL = 'https://tokenx-token-generator.intern.dev.nav.no/api/obo';
const ENV_FIL = process.env.ENV_FILE || '.env';

const TARGET_AUDIENCES = [
  'dev-gcp:teamfamilie:familie-ef-soknad-api',
  'dev-gcp:teamfamilie:familie-dokument',
];

interface HentTokenRespons {
  access_token: string;
  expires_in: number;
}

type TokenPar = {
  api: string;
  dokument: string;
};

function promptForPersonIdent(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('Legg inn person ident fra Dolly: ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function hentToken(audience: string, personIdent: string): Promise<string> {
  const browser = await chromium.launch({
    headless: process.env.HEADLESS !== 'false',
    slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0,
  });

  try {
    const context = await browser.newContext();
    const side = await context.newPage();

    const tokenUrl = `${TOKENX_BASE_URL}?aud=${encodeURIComponent(audience)}`;
    await side.goto(tokenUrl, { waitUntil: 'domcontentloaded' });
    await side.waitForURL(/login\.test\.idporten\.no/, { timeout: 20000 });
    await side.waitForLoadState('networkidle');

    if (side.url().includes('selector')) {
      const testIdSelectors = [
        'text=Test ID',
        'text=TestID',
        'a[href*="testid"]',
        'button[data-method="testid"]',
        '[data-testid*="testid"]',
        'text="Test ID"',
        ':text("Test")',
      ];

      let testIdKnapp = null;
      for (const selector of testIdSelectors) {
        const element = side.locator(selector);
        if ((await element.count()) > 0) {
          testIdKnapp = element.first();
          break;
        }
      }

      if (!testIdKnapp) {
        throw new Error('Fant ikke Test ID valg.');
      }

      await testIdKnapp.click();
      await side.waitForURL(/testid\.test\.idporten\.no/, { timeout: 10000 });
    }

    const pidInput = side.locator('input[name="pid"]');
    await pidInput.waitFor({ state: 'visible', timeout: 10000 });
    await pidInput.fill(personIdent);

    const authKnapp = side.locator(
      'button:has-text("Authenticate"), button[type="submit"], input[type="submit"]'
    );
    await authKnapp.first().click();

    try {
      await side.waitForURL(
        (url) => {
          const erTokenGenerator = url.href.startsWith(TOKENX_BASE_URL);
          const audienceParam = audience.replace(/:/g, '%3A');
          const harRiktigAudience =
            url.href.includes(`aud=${encodeURIComponent(audience)}`) ||
            url.href.includes(`aud=${audienceParam}`) ||
            url.href.includes(audience.split(':')[2]);
          return erTokenGenerator && harRiktigAudience;
        },
        { timeout: 60000 }
      );

      await side.waitForLoadState('networkidle');
      const content = await side.textContent('body');
      const tokenData = JSON.parse(content!);
      return tokenData.access_token;
    } catch {
      const tokenResponse = await side.waitForResponse(
        (resp) =>
          resp.url().startsWith(TOKENX_BASE_URL) &&
          resp.url().includes(`aud=${encodeURIComponent(audience)}`),
        { timeout: 30000 }
      );

      if (!tokenResponse.ok()) {
        throw new Error(`Token forespørsel feilet: ${tokenResponse.status()}`);
      }

      const tokenData: HentTokenRespons = await tokenResponse.json();
      return tokenData.access_token;
    }
  } finally {
    await browser.close();
  }
}

async function oppdaterEnvFil(tokens: TokenPar): Promise<void> {
  const envPath = path.resolve(ENV_FIL);

  let envInnhold = '';
  if (fs.existsSync(envPath)) {
    envInnhold = fs.readFileSync(envPath, 'utf-8');
  }

  const oppdaterEllerLeggTil = (nøkkel: string, verdi: string) => {
    const regex = new RegExp(`^${nøkkel}=.*$`, 'm');
    if (envInnhold.includes(`${nøkkel}=`)) {
      envInnhold = envInnhold.replace(regex, `${nøkkel}=${verdi}`);
    } else {
      envInnhold += (envInnhold && !envInnhold.endsWith('\n') ? '\n' : '') + `${nøkkel}=${verdi}\n`;
    }
  };

  oppdaterEllerLeggTil('TOKENX_API', tokens.api);
  oppdaterEllerLeggTil('TOKENX_DOKUMENT', tokens.dokument);

  fs.writeFileSync(envPath, envInnhold, 'utf-8');
}

async function main(): Promise<void> {
  const erProd = process.env.ENV === 'prod';

  if (erProd) {
    throw new Error('Fant prod i miljø, kan ikke hente dev tokens.');
  }

  try {
    const personIdent = await promptForPersonIdent();

    if (!personIdent || personIdent.length !== 11 || !/^\d{11}$/.test(personIdent)) {
      throw new Error('Ugyldig person ident. Må være 11 siffer.');
    }

    const apiToken = await hentToken(TARGET_AUDIENCES[0], personIdent);
    const dokumentToken = await hentToken(TARGET_AUDIENCES[1], personIdent);

    await oppdaterEnvFil({
      api: apiToken,
      dokument: dokumentToken,
    });

    console.log('Tokens hentet og lagret i .env fil');
  } catch (error) {
    console.error('Feil ved henting av tokens:', error);
    process.exit(1);
  }
}

main().catch(console.error);
