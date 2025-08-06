import Environment from '../Environment';
import {
  lagBooleanFelt,
  lagDatoFelt,
  lagIBarn,
  lagIMedforelder,
  lagMellomlagretSøknadBarnetilsyn,
  lagMellomlagretSøknadOvergangsstønad,
  lagMellomlagretSøknadSkolepenger,
  lagPerson,
  lagPersonData,
  lagSpørsmålBooleanFelt,
  lagSpørsmålFelt,
  lagSøker,
  lagSøknadBarnetilsyn,
  lagSøknadOvergangsstønad,
  lagTekstfelt,
} from './domeneUtils';
import { Søker } from '../models/søknad/person';
import axios from 'axios';
import { ESøknad, SøknadOvergangsstønad } from '../søknader/overgangsstønad/models/søknad';
import { ESvar } from '../models/felles/spørsmålogsvar';
import { EBegrunnelse, ESivilstatusSøknadid } from '../models/steg/omDeg/sivilstatus';
import { EBosituasjon, ESøkerDelerBolig } from '../models/steg/bosituasjon';
import { isoDatoEnMånedTilbake } from './dato';
import { dagensIsoDatoMinusMåneder } from '../utils/dato';
import { SøknadBarnetilsyn } from '../søknader/barnetilsyn/models/søknad';

type StønadType = 'overgangsstonad' | 'barnetilsyn' | 'skolepenger';
type SøknadSteg =
  | '/om-deg'
  | '/bosituasjon'
  | '/barn'
  | '/barnas-bosted'
  | '/aktivitet'
  | '/din-situasjon'
  | '/barnepass'
  | '/oppsummering'
  | '/dokumentasjon'
  | '/kvittering';

export const mockGet = (url: string, stønadType: StønadType) => {
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
  if (url === `${Environment().mellomlagerProxyUrl + stønadType}`) {
    return Promise.resolve({
      data: utledMellomlagretSøknad(stønadType),
    });
  }
  if (url === `${Environment().apiProxyUrl}/api/soknad/sist-innsendt-per-stonad`) {
    return Promise.resolve({
      data: [],
    });
  }
  return Promise.resolve({ data: {} });
};

const utledMellomlagretSøknad = (stønadType: StønadType) => {
  switch (stønadType) {
    case 'overgangsstonad':
      return lagMellomlagretSøknadOvergangsstønad();
    case 'barnetilsyn':
      return lagMellomlagretSøknadBarnetilsyn();
    case 'skolepenger':
      return lagMellomlagretSøknadSkolepenger();
  }
};

export const mockPost = (url: string, stønadstype: StønadType) => {
  if (url === `${Environment().mellomlagerProxyUrl + stønadstype}`) {
    return Promise.resolve({
      data: lagSøknadOvergangsstønad(),
    });
  }
};

export const mockMellomlagretSøknadOvergangsstønad = (
  stønadstype: StønadType,
  gjeldendeSteg?: SøknadSteg,
  søker?: Partial<Søker>,
  søknad?: Partial<SøknadOvergangsstønad>
) => {
  (axios.get as any).mockImplementation((url: string) => {
    if (url === `${Environment().mellomlagerProxyUrl + stønadstype}`) {
      return gjeldendeSteg
        ? Promise.resolve({
            data: lagMellomlagretSøknadOvergangsstønad({
              søknad: utledSøknadOvergangsstønad(gjeldendeSteg, søknad),
              gjeldendeSteg: gjeldendeSteg,
            }),
          })
        : undefined;
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
  gjeldendeSteg?: SøknadSteg,
  søker?: Partial<Søker>,
  søknad?: Partial<SøknadBarnetilsyn>
) => {
  (axios.get as any).mockImplementation((url: string) => {
    if (url === `${Environment().mellomlagerProxyUrl + stønadstype}`) {
      return gjeldendeSteg
        ? Promise.resolve({
            data: lagMellomlagretSøknadBarnetilsyn({
              søknad: utledSøknadBarnetilsyn(gjeldendeSteg, søknad),
              gjeldendeSteg: gjeldendeSteg,
            }),
          })
        : undefined;
    }

    if (url === `${Environment().apiProxyUrl + '/api/soknad/barnetilsyn/forrige'}`) {
      return gjeldendeSteg
        ? Promise.resolve({
            data: lagMellomlagretSøknadBarnetilsyn({
              søknad: utledSøknadBarnetilsyn(gjeldendeSteg, søknad),
              gjeldendeSteg: gjeldendeSteg,
            }),
          })
        : undefined;
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
    case '/barnas-bosted':
      return søknadOvergangsstønadBarnasBosted(søknad);
    case '/aktivitet':
      return lagSøknadOvergangsstønad({ harBekreftet: true });
    case '/din-situasjon':
      return søknadOvergangsstønadBarnasBosted(søknad);
    default:
      return lagSøknadOvergangsstønad({ harBekreftet: true });
  }
};

const utledSøknadBarnetilsyn = (gjeldendeSteg: SøknadSteg, søknad?: Partial<SøknadBarnetilsyn>) => {
  switch (gjeldendeSteg) {
    case '/barn':
      return søknadBarnetilsyndBarnaDine(søknad);
    case '/barnas-bosted':
      return søknadBarnetilsynBarnasBosted(søknad);
    case '/barnepass':
      return søknadBarnetilsynBarnasBosted(søknad);
    default:
      return lagSøknadBarnetilsyn({ harBekreftet: true });
  }
};

const søknadOvergangsstønadOmDeg = lagSøknadOvergangsstønad({
  harBekreftet: true,
});

const søknadOvergangsstønadBosituasjon = lagSøknadOvergangsstønad({
  harBekreftet: true,
  søkerBorPåRegistrertAdresse: lagSpørsmålBooleanFelt({
    spørsmålid: ESøknad.søkerBorPåRegistrertAdresse,
    svarid: ESvar.JA,
    label: 'Bor du på denne adressen?',
    verdi: true,
  }),
  sivilstatus: {
    harSøktSeparasjon: lagBooleanFelt(
      'Har dere søkt om separasjon, søkt om skilsmisse eller reist sak for domstolen?',
      true
    ),
    datoSøktSeparasjon: lagDatoFelt('Når søkte dere eller reiste sak?', isoDatoEnMånedTilbake),
    årsakEnslig: lagSpørsmålFelt({
      spørsmålid: ESivilstatusSøknadid.årsakEnslig,
      svarid: EBegrunnelse.samlivsbruddAndre,
      label: 'Hvorfor er du alene med barn?',
      verdi: 'Samlivsbrudd med den andre forelderen',
    }),
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
    søkerBorPåRegistrertAdresse: lagSpørsmålBooleanFelt({
      spørsmålid: ESøknad.søkerBorPåRegistrertAdresse,
      svarid: ESvar.JA,
      label: 'Bor du på denne adressen?',
      verdi: true,
    }),
    sivilstatus: {
      harSøktSeparasjon: lagBooleanFelt(
        'Har dere søkt om separasjon, søkt om skilsmisse eller reist sak for domstolen?',
        true
      ),
      datoSøktSeparasjon: lagDatoFelt('Når søkte dere eller reiste sak?', isoDatoEnMånedTilbake),
      årsakEnslig: lagSpørsmålFelt({
        spørsmålid: ESivilstatusSøknadid.årsakEnslig,
        svarid: EBegrunnelse.samlivsbruddAndre,
        label: 'Hvorfor er du alene med barn?',
        verdi: 'Samlivsbrudd med den andre forelderen',
      }),
    },
    medlemskap: {
      søkerOppholderSegINorge: lagBooleanFelt('Oppholder du og barnet/barna dere i Norge?', true),
      søkerBosattINorgeSisteTreÅr: lagBooleanFelt(
        'Har du oppholdt deg i Norge de siste 5 årene?',
        true
      ),
    },
    bosituasjon: {
      delerBoligMedAndreVoksne: lagSpørsmålFelt({
        spørsmålid: EBosituasjon.delerBoligMedAndreVoksne,
        svarid: ESøkerDelerBolig.borAleneMedBarnEllerGravid,
        label: 'Deler du bolig med andre voksne?',
        verdi: 'Nei, jeg bor alene med barn eller jeg er gravid og bor alene',
      }),
      skalGifteSegEllerBliSamboer: lagSpørsmålBooleanFelt({
        spørsmålid: EBosituasjon.skalGifteSegEllerBliSamboer,
        svarid: ESvar.NEI,
        label: 'Har du konkrete planer om å gifte deg eller bli samboer?',
        verdi: false,
      }),
    },
    ...søknad,
  });

const søknadOvergangsstønadBarnasBosted = (søknad?: Partial<SøknadOvergangsstønad>) =>
  lagSøknadOvergangsstønad({
    harBekreftet: true,
    søkerBorPåRegistrertAdresse: lagSpørsmålBooleanFelt({
      spørsmålid: ESøknad.søkerBorPåRegistrertAdresse,
      svarid: ESvar.JA,
      label: 'Bor du på denne adressen?',
      verdi: true,
    }),
    sivilstatus: {
      harSøktSeparasjon: lagBooleanFelt(
        'Har dere søkt om separasjon, søkt om skilsmisse eller reist sak for domstolen?',
        true
      ),
      datoSøktSeparasjon: lagDatoFelt(
        'Når søkte dere eller reiste sak?',
        dagensIsoDatoMinusMåneder(1)
      ),
      årsakEnslig: lagSpørsmålFelt({
        spørsmålid: ESivilstatusSøknadid.årsakEnslig,
        svarid: EBegrunnelse.samlivsbruddAndre,
        label: 'Hvorfor er du alene med barn?',
        verdi: 'Samlivsbrudd med den andre forelderen',
      }),
    },
    medlemskap: {
      søkerOppholderSegINorge: lagBooleanFelt('Oppholder du og barnet/barna dere i Norge?', true),
      søkerBosattINorgeSisteTreÅr: lagBooleanFelt(
        'Har du oppholdt deg i Norge de siste 5 årene?',
        true
      ),
    },
    bosituasjon: {
      delerBoligMedAndreVoksne: lagSpørsmålFelt({
        spørsmålid: EBosituasjon.delerBoligMedAndreVoksne,
        svarid: ESøkerDelerBolig.borAleneMedBarnEllerGravid,
        label: 'Deler du bolig med andre voksne?',
        verdi: 'Nei, jeg bor alene med barn eller jeg er gravid og bor alene',
      }),
      skalGifteSegEllerBliSamboer: lagSpørsmålBooleanFelt({
        spørsmålid: EBosituasjon.skalGifteSegEllerBliSamboer,
        svarid: ESvar.NEI,
        label: 'Har du konkrete planer om å gifte deg eller bli samboer?',
        verdi: false,
      }),
    },
    person: lagPerson({
      barn: [
        lagIBarn({
          navn: lagTekstfelt({ label: 'Navn', verdi: 'GÅEN PC' }),
          fødselsdato: lagTekstfelt({ label: '', verdi: dagensIsoDatoMinusMåneder(65) }),
          ident: lagTekstfelt({ label: '', verdi: '18877598140' }),
          født: lagSpørsmålBooleanFelt({ spørsmålid: '', svarid: '', label: '', verdi: true }),
          alder: lagTekstfelt({ label: 'Alder', verdi: '5' }),
          harSammeAdresse: lagBooleanFelt('', true),
          medforelder: {
            label: '',
            verdi: lagIMedforelder({ navn: 'GÅEN SKADE' }),
          },
        }),
      ],
    }),

    ...søknad,
  });

const søknadBarnetilsyndBarnaDine = (søknad?: Partial<SøknadBarnetilsyn>) =>
  lagSøknadBarnetilsyn({
    harBekreftet: true,
    søkerBorPåRegistrertAdresse: lagSpørsmålBooleanFelt({
      spørsmålid: ESøknad.søkerBorPåRegistrertAdresse,
      svarid: ESvar.JA,
      label: 'Bor du på denne adressen?',
      verdi: true,
    }),
    sivilstatus: {
      harSøktSeparasjon: lagBooleanFelt(
        'Har dere søkt om separasjon, søkt om skilsmisse eller reist sak for domstolen?',
        true
      ),
      datoSøktSeparasjon: lagDatoFelt('Når søkte dere eller reiste sak?', isoDatoEnMånedTilbake),
      årsakEnslig: lagSpørsmålFelt({
        spørsmålid: ESivilstatusSøknadid.årsakEnslig,
        svarid: EBegrunnelse.samlivsbruddAndre,
        label: 'Hvorfor er du alene med barn?',
        verdi: 'Samlivsbrudd med den andre forelderen',
      }),
    },
    medlemskap: {
      søkerOppholderSegINorge: lagBooleanFelt('Oppholder du og barnet/barna dere i Norge?', true),
      søkerBosattINorgeSisteTreÅr: lagBooleanFelt(
        'Har du oppholdt deg i Norge de siste 5 årene?',
        true
      ),
    },
    bosituasjon: {
      delerBoligMedAndreVoksne: lagSpørsmålFelt({
        spørsmålid: EBosituasjon.delerBoligMedAndreVoksne,
        svarid: ESøkerDelerBolig.borAleneMedBarnEllerGravid,
        label: 'Deler du bolig med andre voksne?',
        verdi: 'Nei, jeg bor alene med barn eller jeg er gravid og bor alene',
      }),
      skalGifteSegEllerBliSamboer: lagSpørsmålBooleanFelt({
        spørsmålid: EBosituasjon.skalGifteSegEllerBliSamboer,
        svarid: ESvar.NEI,
        label: 'Har du konkrete planer om å gifte deg eller bli samboer?',
        verdi: false,
      }),
    },
    ...søknad,
  });

const søknadBarnetilsynBarnasBosted = (søknad?: Partial<SøknadBarnetilsyn>) =>
  lagSøknadBarnetilsyn({
    harBekreftet: true,
    søkerBorPåRegistrertAdresse: lagSpørsmålBooleanFelt({
      spørsmålid: ESøknad.søkerBorPåRegistrertAdresse,
      svarid: ESvar.JA,
      label: 'Bor du på denne adressen?',
      verdi: true,
    }),
    sivilstatus: {
      harSøktSeparasjon: lagBooleanFelt(
        'Har dere søkt om separasjon, søkt om skilsmisse eller reist sak for domstolen?',
        true
      ),
      datoSøktSeparasjon: lagDatoFelt(
        'Når søkte dere eller reiste sak?',
        dagensIsoDatoMinusMåneder(1)
      ),
      årsakEnslig: lagSpørsmålFelt({
        spørsmålid: ESivilstatusSøknadid.årsakEnslig,
        svarid: EBegrunnelse.samlivsbruddAndre,
        label: 'Hvorfor er du alene med barn?',
        verdi: 'Samlivsbrudd med den andre forelderen',
      }),
    },
    medlemskap: {
      søkerOppholderSegINorge: lagBooleanFelt('Oppholder du og barnet/barna dere i Norge?', true),
      søkerBosattINorgeSisteTreÅr: lagBooleanFelt(
        'Har du oppholdt deg i Norge de siste 5 årene?',
        true
      ),
    },
    bosituasjon: {
      delerBoligMedAndreVoksne: lagSpørsmålFelt({
        spørsmålid: EBosituasjon.delerBoligMedAndreVoksne,
        svarid: ESøkerDelerBolig.borAleneMedBarnEllerGravid,
        label: 'Deler du bolig med andre voksne?',
        verdi: 'Nei, jeg bor alene med barn eller jeg er gravid og bor alene',
      }),
      skalGifteSegEllerBliSamboer: lagSpørsmålBooleanFelt({
        spørsmålid: EBosituasjon.skalGifteSegEllerBliSamboer,
        svarid: ESvar.NEI,
        label: 'Har du konkrete planer om å gifte deg eller bli samboer?',
        verdi: false,
      }),
    },
    person: lagPerson({
      barn: [
        lagIBarn({
          navn: lagTekstfelt({ label: 'Navn', verdi: 'GÅEN PC' }),
          fødselsdato: lagTekstfelt({ label: '', verdi: dagensIsoDatoMinusMåneder(65) }),
          ident: lagTekstfelt({ label: '', verdi: '18877598140' }),
          født: lagSpørsmålBooleanFelt({ spørsmålid: '', svarid: '', label: '', verdi: true }),
          alder: lagTekstfelt({ label: 'Alder', verdi: '5' }),
          harSammeAdresse: lagBooleanFelt('', true),
          medforelder: {
            label: '',
            verdi: lagIMedforelder({ navn: 'GÅEN SKADE' }),
          },
          skalHaBarnepass: lagSpørsmålBooleanFelt({
            spørsmålid: '',
            svarid: '',
            label: '',
            verdi: true,
          }),
        }),
      ],
    }),

    ...søknad,
  });
