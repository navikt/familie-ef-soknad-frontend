import Environment from '../Environment';
import { lagMellomlagretSøknadOvergangsstønad, lagPersonData, lagSøker } from './utils';

export const mockGet = (
  url: string,
  stønadstype: 'overgangsstonad' | 'barnetilsyn' | 'skolepenger'
) => {
  if (url === `${Environment().apiProxyUrl}/api/innlogget`) {
    return Promise.resolve({ status: 200 });
  }
  if (url === `${Environment().apiProxyUrl}/api/oppslag/sokerinfo`) {
    return Promise.resolve({
      data: lagPersonData({
        søker: lagSøker({ forkortetNavn: 'Ola Nordmann' }),
      }),
    });
  }
  if (url === `${Environment().mellomlagerProxyUrl + stønadstype}`) {
    return Promise.resolve({
      data: lagMellomlagretSøknadOvergangsstønad(),
    });
  }
  if (url === `${Environment().apiProxyUrl}/api/soknad/sist-innsendt-per-stonad`) {
    return Promise.resolve({
      data: [],
    });
  }
  return Promise.resolve({ data: {} });
};
