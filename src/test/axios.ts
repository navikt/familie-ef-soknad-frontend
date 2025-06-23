import Environment from '../Environment';
import {
  lagMellomlagretSøknadOvergangsstønad,
  lagPerson,
  lagPersonData,
  lagSøker,
  lagSøknadOvergangsstønad,
} from './utils';
import { Søker } from '../models/søknad/person';
import axios from 'axios';

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
  if (
    url === `${Environment().apiProxyUrl}/api/soknad/sist-innsendt-per-stonad`
  ) {
    return Promise.resolve({
      data: [],
    });
  }
  return Promise.resolve({ data: {} });
};

export const settOppMellomlagretSøknad = (søker?: Partial<Søker>) => {
  (axios.get as any).mockImplementation((url: string) => {
    if (url === `${Environment().mellomlagerProxyUrl + 'overgangsstonad'}`) {
      return Promise.resolve({
        data: lagMellomlagretSøknadOvergangsstønad({
          søknad: lagSøknadOvergangsstønad({ harBekreftet: true }),
          gjeldendeSteg: '/om-deg',
        }),
      });
    }

    if (url === `${Environment().apiProxyUrl}/api/oppslag/sokerinfo`) {
      return Promise.resolve({
        data: lagPerson({
          søker: lagSøker({ ...søker }),
        }),
      });
    }

    return mockGet(url, 'overgangsstonad');
  });
};
