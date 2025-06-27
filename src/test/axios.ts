import Environment from '../Environment';
import {
  lagBooleanFelt,
  lagDatoFelt,
  lagMellomlagretSøknadBarnetilsyn,
  lagMellomlagretSøknadOvergangsstønad,
  lagPersonData,
  lagSpørsmålBooleanFelt,
  lagSpørsmålFelt,
  lagSøker,
  lagSøknadBarnetilsyn,
  lagSøknadOvergangsstønad,
} from './utils';
import { Søker } from '../models/søknad/person';
import axios from 'axios';
import { ESøknad, SøknadOvergangsstønad } from '../søknader/overgangsstønad/models/søknad';
import { ESvar } from '../models/felles/spørsmålogsvar';
import { EBegrunnelse, ESivilstatusSøknadid } from '../models/steg/omDeg/sivilstatus';
import { dagensIsoDatoMinusMåneder } from '../utils/dato';
import { EBosituasjon, ESøkerDelerBolig } from '../models/steg/bosituasjon';
import { SøknadBarnetilsyn } from '../søknader/barnetilsyn/models/søknad';

export type StønadType = 'overgangsstonad' | 'barnetilsyn' | 'skolepenger';
type SøknadSteg =
  | '/om-deg'
  | '/bosituasjon'
  | '/barn'
  | '/barnas-bosted'
  | '/aktivitet'
  | '/barnepass'
  | '/oppsummering'
  | '/dokumentasjon'
  | '/kvittering';

export const mockGet = (url: string, stønadstype: StønadType) => {
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
      data:
        stønadstype === 'overgangsstonad'
          ? lagMellomlagretSøknadOvergangsstønad()
          : lagMellomlagretSøknadBarnetilsyn,
    });
  }
  if (url === `${Environment().apiProxyUrl}/api/soknad/sist-innsendt-per-stonad`) {
    return Promise.resolve({
      data: [],
    });
  }
  return Promise.resolve({ data: {} });
};

export const mockMellomlagretSøknadOvergangsstønad = (
  stønadstype: StønadType,
  gjeldendeSteg: SøknadSteg,
  søker?: Partial<Søker>,
  søknad?: Partial<SøknadOvergangsstønad>
) => {
  (axios.get as any).mockImplementation((url: string) => {
    if (url === `${Environment().mellomlagerProxyUrl + stønadstype}`) {
      return Promise.resolve({
        data: lagMellomlagretSøknadOvergangsstønad({
          søknad: utledSøknadOvergangsstønad(gjeldendeSteg, søknad),
          gjeldendeSteg: gjeldendeSteg,
        }),
      });
    }

    if (url === `${Environment().apiProxyUrl}/api/oppslag/sokerinfo`) {
      return Promise.resolve({
        data: lagPersonData({
          søker: lagSøker({ ...søker }),
        }),
      });
    }

    return mockGet(url, stønadstype);
  });
};

export const mockMellomlagretSøknadBarnetilsyn = (
  stønadstype: StønadType,
  gjeldendeSteg: SøknadSteg,
  søker?: Partial<Søker>,
  søknad?: Partial<SøknadBarnetilsyn>
) => {
  (axios.get as any).mockImplementation((url: string) => {
    if (url === `${Environment().mellomlagerProxyUrl + stønadstype}`) {
      return Promise.resolve({
        data: lagMellomlagretSøknadBarnetilsyn({
          søknad: utledSøknadBarnetilsyn(gjeldendeSteg, søknad),
          gjeldendeSteg: gjeldendeSteg,
        }),
      });
    }

    if (url === `${Environment().apiProxyUrl}/api/oppslag/sokerinfo`) {
      return Promise.resolve({
        data: lagPersonData({
          søker: lagSøker({ ...søker }),
        }),
      });
    }

    return mockGet(url, stønadstype);
  });
};

const utledSøknadOvergangsstønad = (
  gjeldendeSteg: SøknadSteg,
  søknad?: Partial<SøknadOvergangsstønad>
) => {
  switch (gjeldendeSteg) {
    case '/om-deg':
      return søknadOvergangsstønadOmDeg;
    case '/bosituasjon':
      return søknadOvergangsstønadBosituasjon;
    case '/barn':
      return søknadOvergangsstønadBarnaDine(søknad);
    default:
      return lagSøknadOvergangsstønad({ harBekreftet: true });
  }
};

const søknadOvergangsstønadOmDeg = lagSøknadOvergangsstønad({
  harBekreftet: true,
});

const søknadOvergangsstønadBosituasjon = lagSøknadOvergangsstønad({
  harBekreftet: true,
  søkerBorPåRegistrertAdresse: lagSpørsmålBooleanFelt(
    ESøknad.søkerBorPåRegistrertAdresse,
    ESvar.JA,
    'Bor du på denne adressen?',
    true
  ),
  sivilstatus: {
    harSøktSeparasjon: lagBooleanFelt(
      'Har dere søkt om separasjon, søkt om skilsmisse eller reist sak for domstolen?',
      true
    ),
    datoSøktSeparasjon: lagDatoFelt(
      'Når søkte dere eller reiste sak?',
      dagensIsoDatoMinusMåneder(1)
    ),
    årsakEnslig: lagSpørsmålFelt(
      ESivilstatusSøknadid.årsakEnslig,
      EBegrunnelse.samlivsbruddAndre,
      'Hvorfor er du alene med barn?',
      'Samlivsbrudd med den andre forelderen'
    ),
  },
  medlemskap: {
    søkerOppholderSegINorge: lagBooleanFelt('Oppholder du og barnet/barna dere i Norge?', true),
    søkerBosattINorgeSisteTreÅr: lagBooleanFelt(
      'Har du oppholdt deg i Norge de siste 5 årene?',
      true
    ),
  },
});

const søknadOvergangsstønadBarnaDine = (søknad?: Partial<SøknadOvergangsstønad>) =>
  lagSøknadOvergangsstønad({
    harBekreftet: true,
    søkerBorPåRegistrertAdresse: lagSpørsmålBooleanFelt(
      ESøknad.søkerBorPåRegistrertAdresse,
      ESvar.JA,
      'Bor du på denne adressen?',
      true
    ),
    sivilstatus: {
      harSøktSeparasjon: lagBooleanFelt(
        'Har dere søkt om separasjon, søkt om skilsmisse eller reist sak for domstolen?',
        true
      ),
      datoSøktSeparasjon: lagDatoFelt(
        'Når søkte dere eller reiste sak?',
        dagensIsoDatoMinusMåneder(1)
      ),
      årsakEnslig: lagSpørsmålFelt(
        ESivilstatusSøknadid.årsakEnslig,
        EBegrunnelse.samlivsbruddAndre,
        'Hvorfor er du alene med barn?',
        'Samlivsbrudd med den andre forelderen'
      ),
    },
    medlemskap: {
      søkerOppholderSegINorge: lagBooleanFelt('Oppholder du og barnet/barna dere i Norge?', true),
      søkerBosattINorgeSisteTreÅr: lagBooleanFelt(
        'Har du oppholdt deg i Norge de siste 5 årene?',
        true
      ),
    },
    bosituasjon: {
      delerBoligMedAndreVoksne: lagSpørsmålFelt(
        EBosituasjon.delerBoligMedAndreVoksne,
        ESøkerDelerBolig.borAleneMedBarnEllerGravid,
        'Deler du bolig med andre voksne?',
        'Nei, jeg bor alene med barn eller jeg er gravid og bor alene'
      ),
      skalGifteSegEllerBliSamboer: lagSpørsmålBooleanFelt(
        EBosituasjon.skalGifteSegEllerBliSamboer,
        ESvar.NEI,
        'Har du konkrete planer om å gifte deg eller bli samboer?',
        false
      ),
    },
    ...søknad,
  });

const utledSøknadBarnetilsyn = (gjeldendeSteg: SøknadSteg, søknad?: Partial<SøknadBarnetilsyn>) => {
  switch (gjeldendeSteg) {
    case '/barn':
      return søknadBarnetilsynBarnaDine(søknad);
    default:
      return lagSøknadBarnetilsyn({ harBekreftet: true });
  }
};

const søknadBarnetilsynBarnaDine = (søknad?: Partial<SøknadOvergangsstønad>) =>
  lagSøknadBarnetilsyn({
    harBekreftet: true,
    søkerBorPåRegistrertAdresse: lagSpørsmålBooleanFelt(
      ESøknad.søkerBorPåRegistrertAdresse,
      ESvar.JA,
      'Bor du på denne adressen?',
      true
    ),
    sivilstatus: {
      harSøktSeparasjon: lagBooleanFelt(
        'Har dere søkt om separasjon, søkt om skilsmisse eller reist sak for domstolen?',
        true
      ),
      datoSøktSeparasjon: lagDatoFelt(
        'Når søkte dere eller reiste sak?',
        dagensIsoDatoMinusMåneder(1)
      ),
      årsakEnslig: lagSpørsmålFelt(
        ESivilstatusSøknadid.årsakEnslig,
        EBegrunnelse.samlivsbruddAndre,
        'Hvorfor er du alene med barn?',
        'Samlivsbrudd med den andre forelderen'
      ),
    },
    medlemskap: {
      søkerOppholderSegINorge: lagBooleanFelt('Oppholder du og barnet/barna dere i Norge?', true),
      søkerBosattINorgeSisteTreÅr: lagBooleanFelt(
        'Har du oppholdt deg i Norge de siste 5 årene?',
        true
      ),
    },
    bosituasjon: {
      delerBoligMedAndreVoksne: lagSpørsmålFelt(
        EBosituasjon.delerBoligMedAndreVoksne,
        ESøkerDelerBolig.borAleneMedBarnEllerGravid,
        'Deler du bolig med andre voksne?',
        'Nei, jeg bor alene med barn eller jeg er gravid og bor alene'
      ),
      skalGifteSegEllerBliSamboer: lagSpørsmålBooleanFelt(
        EBosituasjon.skalGifteSegEllerBliSamboer,
        ESvar.NEI,
        'Har du konkrete planer om å gifte deg eller bli samboer?',
        false
      ),
    },
    ...søknad,
  });
