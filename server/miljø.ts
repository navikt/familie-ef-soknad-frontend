import logger from './logger';
import 'dotenv/config';

interface Miljø {
  dokumentUrl: string;
  apiUrl: string;
  lokaltTokenxApi: string | undefined;
  lokaltTokenxDokument: string | undefined;
  brukDevApi: boolean;
  erLokalt: boolean;
}

const brukDevApi = process.env.BRUK_DEV_API === 'true';
const erLokalt = process.env.ENV === 'localhost';
const erMockLokalt = process.env.BRUK_MOCK_LOKALT === 'true';

const lokaltMockMiljø = {
  dokumentUrl: 'http://localhost:8092',
  apiUrl: 'http://localhost:8092',
};

const lokaltMiljø = {
  dokumentUrl: brukDevApi
    ? 'https://familie-dokument.intern.dev.nav.no/familie/dokument'
    : 'http://localhost:8082',
  apiUrl: brukDevApi
    ? 'https://familie-ef-soknad-api.intern.dev.nav.no/familie/alene-med-barn/soknad-api'
    : 'http://localhost:8091',
};

const devMiljø = {
  dokumentUrl: 'http://familie-dokument/familie/dokument',
  apiUrl: 'http://familie-ef-soknad-api/familie/alene-med-barn/soknad-api',
};

const prodMiljø = {
  dokumentUrl: 'http://familie-dokument/familie/dokument',
  apiUrl: 'http://familie-ef-soknad-api/familie/alene-med-barn/soknad-api',
};

const initierMiljøvariabler = () => {
  if (erMockLokalt) {
    return lokaltMockMiljø;
  }
  switch (process.env.ENV) {
    case 'localhost':
      return lokaltMiljø;
    case 'dev':
      return devMiljø;
    case 'prod':
      return prodMiljø;
    default:
      logger.warn('Mangler miljøvariabler - setter lokale variabler');
      return lokaltMiljø;
  }
};

export const miljø: Miljø = {
  ...initierMiljøvariabler(),
  lokaltTokenxApi: process.env.TOKENX_API,
  lokaltTokenxDokument: process.env.TOKENX_DOKUMENT,
  brukDevApi,
  erLokalt,
};
