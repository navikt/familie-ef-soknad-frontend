import {
  DecoratorParams,
  fetchDecoratorHtml,
  injectDecoratorServerSide,
} from '@navikt/nav-dekoratoren-moduler/ssr';
import logger from './logger';
import { miljø } from './miljø';

type NaisEnv = 'prod' | 'dev';

const hentDekoratørConfig = () => {
  const env = process.env.ENV;
  if (env === undefined) {
    logger.error('Mangler miljø for dekoratøren');
    throw Error('Miljø kan ikke være undefined');
  }

  const dekoratørParams: DecoratorParams = {
    simple: true,
    redirectToApp: true,
    level: 'Level4',
  };

  return {
    env: miljø.erLokalt ? 'dev' : (env as NaisEnv),
    params: dekoratørParams,
  };
};

const naisMetaTags = (): string => {
  const metadata: [string, string | undefined][] = [
    ['nais-app', process.env.NAIS_APP_NAME],
    ['nais-team', process.env.NAIS_NAMESPACE ?? process.env.NAIS_TEAM],
    ['nais-cluster', process.env.NAIS_CLUSTER_NAME],
    ['nais-version', process.env.APP_VERSION],
    ['nais-telemetry-url', process.env.NAIS_FRONTEND_TELEMETRY_COLLECTOR_URL],
  ];

  return metadata
    .filter((entry): entry is [string, string] => Boolean(entry[1]))
    .map(([name, value]) => `<meta name="${name}" content="${value.replaceAll('"', '&quot;')}">`)
    .join('\n    ');
};

const injectNaisMetaTags = (html: string): string =>
  html.replace('</head>', `${naisMetaTags()}\n  </head>`);

export const hentHtmlMedDekoratør = async (path: string): Promise<string> => {
  const html = await injectDecoratorServerSide({
    ...hentDekoratørConfig(),
    filePath: path,
  });
  return injectNaisMetaTags(html);
};

export const injectDekoratørIHtml = async (html: string): Promise<string> => {
  const elementer = await fetchDecoratorHtml(hentDekoratørConfig());

  const dekoratørHtml = html
    .replace('</head>', `${elementer.DECORATOR_HEAD_ASSETS}</head>`)
    .replace('<body>', `<body>${elementer.DECORATOR_HEADER}`)
    .replace('</body>', `${elementer.DECORATOR_FOOTER}${elementer.DECORATOR_SCRIPTS}</body>`);

  return injectNaisMetaTags(dekoratørHtml);
};
