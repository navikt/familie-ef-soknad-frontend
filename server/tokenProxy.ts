import { NextFunction, Request, RequestHandler, Response } from 'express';
import { logWarn, logInfo } from './logger';
import { miljø } from './miljø';
import { requestOboToken, validateToken } from '@navikt/oasis';

export type ApplicationName = 'familie-ef-soknad-api' | 'familie-dokument';

const AUTHORIZATION_HEADER = 'authorization';
const WONDERWALL_ID_TOKEN_HEADER = 'x-wonderwall-id-token';

const attachToken = (applicationName: ApplicationName): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    req.headers[AUTHORIZATION_HEADER] =
      miljø.erLokalt && !miljø.brukDevApi
        ? await getFakedingsToken(applicationName)
        : await getAccessToken(req, applicationName);
    req.headers[WONDERWALL_ID_TOKEN_HEADER] = '';
    next();
  };
};

const erProd = () => {
  return process.env.ENV === 'prod';
};

const harBearerToken = (authorization: string) => {
  return authorization.includes('Bearer ');
};

const utledToken = (authorization: string | undefined) => {
  if (authorization && harBearerToken(authorization)) {
    return authorization.split(' ')[1];
  } else {
    throw Error('Mangler authorization i header');
  }
};

const getAccessToken = async (
  req: Request,
  applicationName: ApplicationName
): Promise<string | undefined> => {
  try {
    logInfo('PrepareSecuredRequest', req);

    if (miljø.erLokalt) {
      const lokalToken =
        applicationName === 'familie-ef-soknad-api'
          ? miljø.lokaltTokenxApi
          : miljø.lokaltTokenxDokument;
      return `Bearer ${lokalToken}`;
    }

    const cluster = erProd() ? 'prod-gcp' : 'dev-gcp';
    const audience = `${cluster}:teamfamilie:${applicationName}`;
    const { authorization } = req.headers;

    if (miljø.erLokalt) {
      return await getFakedingsToken(applicationName);
    }

    const token = utledToken(authorization);
    logInfo('IdPorten-token found: ' + (token.length > 1), req);

    const validation = await validateToken(token);
    if (validation.ok === false) {
      logWarn('Feil under validering av token: ', req, { error: validation.error });
      throw validation.error;
    }

    const accessToken = await requestOboToken(token, `${audience}`);
    if (!accessToken.ok) {
      throw accessToken.error;
    }
    return `Bearer ${accessToken.token}`;
  } catch (error) {
    logWarn(`Noe gikk galt ved setting av token (${req.method} - ${req.path}): `, req, error);
  }
};

const getFakedingsToken = async (applicationName: string): Promise<string> => {
  const clientId = 'dev-gcp:teamfamilie:familie-ef-soknad';
  const audience = `dev-gcp:teamfamilie:${applicationName}`;
  const url = `https://fakedings.intern.dev.nav.no/fake/tokenx?client_id=${clientId}&aud=${audience}&acr=Level4&pid=31458931375`;
  const token = await fetch(url).then(function (body) {
    return body.text();
  });
  return `Bearer ${token}`;
};

export default attachToken;
