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
  lagSøknadSkolepenger,
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
import { SøknadSkolepenger } from '../søknader/skolepenger/models/søknad';

type StønadType = 'overgangsstonad' | 'barnetilsyn' | 'skolepenger';
type SøknadStegOvergangsstønad =
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

type SøknadStegBarnetilsyn =
  | '/barnetilsyn/om-deg'
  | '/barnetilsyn/bosituasjon'
  | '/barnetilsyn/barn'
  | '/barnetilsyn/barnas-bosted'
  | '/barnetilsyn/aktivitet'
  | '/barnetilsyn/din-situasjon'
  | '/barnetilsyn/barnepass'
  | '/barnetilsyn/oppsummering'
  | '/barnetilsyn/dokumentasjon'
  | '/barnetilsyn/kvittering';

type SøknadStegSkolepenger =
  | '/skolepenger/om-deg'
  | '/skolepenger/bosituasjon'
  | '/skolepenger/barn'
  | '/skolepenger/barnas-bosted'
  | '/skolepenger/aktivitet'
  | '/skolepenger/din-situasjon'
  | '/skolepenger/barnepass'
  | '/skolepenger/oppsummering'
  | '/skolepenger/dokumentasjon'
  | '/skolepenger/kvittering';

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
    switch (stønadstype) {
      case 'overgangsstonad':
        return Promise.resolve({
          data: lagSøknadOvergangsstønad(),
        });
      case 'barnetilsyn':
        return Promise.resolve({
          data: lagSøknadBarnetilsyn({ harBekreftet: true }),
        });
    }
  }
};

export const mockMellomlagretSøknadOvergangsstønad = (
  gjeldendeSteg?: SøknadStegOvergangsstønad,
  søker?: Partial<Søker>,
  søknad?: Partial<SøknadOvergangsstønad>
) => {
  (axios.get as any).mockImplementation((url: string) => {
    if (url === `${Environment().mellomlagerProxyUrl + 'overgangsstonad'}`) {
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

    return mockGet(url, 'overgangsstonad');
  });
};

export const mockMellomlagretSøknadBarnetilsyn = (
  gjeldendeSteg?: SøknadStegBarnetilsyn,
  søker?: Partial<Søker>,
  søknad?: Partial<SøknadBarnetilsyn>
) => {
  (axios.get as any).mockImplementation((url: string) => {
    if (url === `${Environment().mellomlagerProxyUrl + 'barnetilsyn'}`) {
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

    return mockGet(url, 'barnetilsyn');
  });
};

export const mockMellomlagretSøknadSkolepenger = (
  gjeldendeSteg?: SøknadStegSkolepenger,
  søker?: Partial<Søker>,
  søknad?: Partial<SøknadSkolepenger>
) => {
  (axios.get as any).mockImplementation((url: string) => {
    if (url === `${Environment().mellomlagerProxyUrl + 'skolepenger'}`) {
      return gjeldendeSteg
        ? Promise.resolve({
            data: lagMellomlagretSøknadSkolepenger({
              søknad: utledSøknadSkolepenger(gjeldendeSteg, søknad),
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

    return mockGet(url, 'skolepenger');
  });
};

const utledSøknadOvergangsstønad = (
  gjeldendeSteg: SøknadStegOvergangsstønad,
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

const utledSøknadBarnetilsyn = (
  gjeldendeSteg: SøknadStegBarnetilsyn,
  søknad?: Partial<SøknadBarnetilsyn>
) => {
  switch (gjeldendeSteg) {
    case '/barnetilsyn/barn':
      return søknadBarnetilsyndBarnaDine(søknad);
    case '/barnetilsyn/barnas-bosted':
      return søknadBarnetilsynBarnasBosted(søknad);
    case '/barnetilsyn/barnepass':
      return søknadBarnetilsynBarnasBosted(søknad);
    default:
      return lagSøknadBarnetilsyn({ harBekreftet: true });
  }
};

const utledSøknadSkolepenger = (
  gjeldendeSteg: SøknadStegSkolepenger,
  søknad?: Partial<SøknadSkolepenger>
) => {
  switch (gjeldendeSteg) {
    case '/skolepenger/aktivitet':
      return søknadSkolepengerBarnasBosted(søknad);
    default:
      return lagSøknadSkolepenger({ harBekreftet: true });
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

const søknadSkolepengerBarnasBosted = (søknad?: Partial<SøknadBarnetilsyn>) =>
  lagSøknadSkolepenger({
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
