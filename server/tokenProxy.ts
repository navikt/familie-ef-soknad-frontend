import { NextFunction, Request, RequestHandler, Response } from 'express';
import TokenXClient from './tokenx';
import { logWarn, logInfo } from './logger';
import { miljø } from './miljø';

const { exchangeToken } = new TokenXClient();

export type ApplicationName = 'familie-ef-soknad-api' | 'familie-dokument';

const AUTHORIZATION_HEADER = 'authorization';
const WONDERWALL_ID_TOKEN_HEADER = 'x-wonderwall-id-token';

const attachToken = (applicationName: ApplicationName): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authenticationHeader = await prepareSecuredRequest(
        req,
        applicationName
      );
      const cookieValue = req.cookies['localhost-idtoken'];
      req.headers[AUTHORIZATION_HEADER] =
        brukCookie() && cookieValue
          ? 'Bearer ' + cookieValue
          : authenticationHeader.authorization;
      req.headers[WONDERWALL_ID_TOKEN_HEADER] = '';
      next();
    } catch (error) {
      logWarn(
        `Noe gikk galt ved setting av token (${req.method} - ${req.path}): `,
        req,
        error
      );
      return res
        .status(401)
        .send('En uventet feil oppstod. Ingen gyldig token');
    }
  };
};

const brukCookie = () => miljø.erLokalt && !miljø.brukDevApi;

const harBearerToken = (authorization: string) => {
  return authorization.includes('Bearer ');
};

const utledToken = (req: Request, authorization: string | undefined) => {
  if (authorization && harBearerToken(authorization)) {
    return authorization.split(' ')[1];
  } else {
    throw Error('Mangler authorization i header');
  }
};

const prepareSecuredRequest = async (
  req: Request,
  applicationName: ApplicationName
) => {
  logInfo('PrepareSecuredRequest', req);
  if (miljø.erLokalt) {
    const lokalToken =
      applicationName === 'familie-ef-soknad-api'
        ? miljø.lokaltTokenxApi
        : miljø.lokaltTokenxDokument;
    return {
      authorization: `Bearer ${lokalToken}`,
    };
  }
  const { authorization } = req.headers;
  const token = utledToken(req, authorization);
  logInfo('IdPorten-token found: ' + (token.length > 1), req);
  const accessToken = await exchangeToken(token, applicationName).then(
    (accessToken) => accessToken
  );
  return {
    authorization: `Bearer ${accessToken}`,
  };
};

export default attachToken;
