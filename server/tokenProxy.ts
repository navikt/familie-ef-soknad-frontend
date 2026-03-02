import { NextFunction, Request, RequestHandler, Response } from 'express';
import { getToken, requestTokenxOboToken } from '@navikt/oasis';
import { logWarn, logInfo } from './logger';
import { miljø } from './miljø';

export type ApplicationName = 'familie-ef-soknad-api' | 'familie-dokument';

const AUTHORIZATION_HEADER = 'authorization';
const WONDERWALL_ID_TOKEN_HEADER = 'x-wonderwall-id-token';

const erProd = () => process.env.ENV === 'prod';

const hentAccessToken = async (
  req: Request,
  applikasjonsnavn: ApplicationName
): Promise<string> => {
  logInfo('PrepareSecuredRequest', req);

  if (miljø.erLokalt) {
    const lokalToken =
      applikasjonsnavn === 'familie-ef-soknad-api'
        ? miljø.lokaltTokenxApi
        : miljø.lokaltTokenxDokument;
    return `Bearer ${lokalToken}`;
  }

  const cluster = erProd() ? 'prod-gcp' : 'dev-gcp';
  const audience = `${cluster}:teamfamilie:${applikasjonsnavn}`;

  const token = getToken(req);
  if (!token) {
    throw Error('Mangler authorization i header');
  }
  logInfo('IdPorten-token found: ' + (token.length > 1), req);

  const oboResult = await requestTokenxOboToken(token, audience);
  if (!oboResult.ok) {
    throw oboResult.error;
  }
  return `Bearer ${oboResult.token}`;
};

const hentFakedingsToken = async (applikasjonsnavn: string): Promise<string> => {
  const clientId = 'dev-gcp:teamfamilie:familie-ef-soknad';
  const audience = `dev-gcp:teamfamilie:${applikasjonsnavn}`;
  const url = `https://fakedings.intern.dev.nav.no/fake/tokenx?client_id=${clientId}&aud=${audience}&acr=Level4&pid=31458931375`;
  const token = await fetch(url).then((body) => body.text());
  return `Bearer ${token}`;
};

export const leggTilToken = (applikasjonsnavn: ApplicationName): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.headers[AUTHORIZATION_HEADER] =
        miljø.erLokalt && !miljø.brukDevApi
          ? await hentFakedingsToken(applikasjonsnavn)
          : await hentAccessToken(req, applikasjonsnavn);
      req.headers[WONDERWALL_ID_TOKEN_HEADER] = '';
      next();
    } catch (error) {
      logWarn(`Noe gikk galt ved setting av token (${req.method} - ${req.path}): `, req, error);
      res.status(401).send('En uventet feil oppstod. Ingen gyldig token');
    }
  };
};
