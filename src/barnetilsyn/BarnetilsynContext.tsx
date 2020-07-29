import { useState } from 'react';
import createUseContext from 'constate';
import tomPerson from '../mock/initialState.json';
import { EBosituasjon } from '../models/steg/bosituasjon';
import { ISpørsmål, ISvar } from '../models/spørsmålogsvar';
import { ISøknad } from './models/søknad';
import {
  hentDokumentasjonTilFlersvarSpørsmål,
  oppdaterDokumentasjonTilEtSvarSpørsmål,
} from '../helpers/steg/dokumentasjon';
import {
  hentMellomlagretBarnetilsynFraDokument,
  mellomlagreBarnetilsynTilDokument,
  nullstillMellomlagretBarnetilsynTilDokument,
} from './utils/søknad';
import { IMellomlagretBarnetilsynSøknad } from './models/mellomlagretSøknad';
import Environment from '../Environment';
import { useIntl } from 'react-intl';
import { EArbeidssituasjon } from '../models/steg/aktivitet/aktivitet';

// -----------  CONTEXT  -----------
const initialState: ISøknad = {
  person: tomPerson,
  sivilstatus: {},
  medlemskap: {},
  bosituasjon: {
    delerBoligMedAndreVoksne: {
      spørsmålid: EBosituasjon.delerBoligMedAndreVoksne,
      svarid: '',
      label: '',
      verdi: '',
    },
  },
  aktivitet: {
    hvaErDinArbeidssituasjon: {
      spørsmålid: EArbeidssituasjon.hvaErDinArbeidssituasjon,
      svarid: [],
      label: '',
      verdi: [],
    },
  },
  dokumentasjonsbehov: [],
  harBekreftet: false,
};

const [BarnetilsynSøknadProvider, useBarnetilsynSøknad] = createUseContext(
  () => {
    const [søknad, settSøknad] = useState<ISøknad>(initialState);

    const [mellomlagretBarnetilsyn, settMellomlagretBarnetilsyn] = useState<
      IMellomlagretBarnetilsynSøknad
    >();
    const intl = useIntl();

    const hentMellomlagretBarnetilsyn = (): Promise<void> => {
      return hentMellomlagretBarnetilsynFraDokument().then(
        (mellomlagretVersjon?: IMellomlagretBarnetilsynSøknad) => {
          if (mellomlagretVersjon) {
            settMellomlagretBarnetilsyn(mellomlagretVersjon);
          }
        }
      );
    };

    const brukMellomlagretBarnetilsyn = () => {
      if (mellomlagretBarnetilsyn) {
        settSøknad(mellomlagretBarnetilsyn.søknad);
      }
    };

    const mellomlagreBarnetilsyn = (steg: string) => {
      const utfyltSøknad = {
        søknad: søknad,
        modellVersjon: Environment().modellVersjon,
        gjeldendeSteg: steg,
      };
      mellomlagreBarnetilsynTilDokument(utfyltSøknad);
      settMellomlagretBarnetilsyn(utfyltSøknad);
    };

    const nullstillMellomlagretBarnetilsyn = (): Promise<any> => {
      return nullstillMellomlagretBarnetilsynTilDokument();
    };

    const settDokumentasjonsbehov = (
      spørsmål: ISpørsmål,
      valgtSvar: ISvar,
      erHuketAv?: boolean
    ) => {
      let endretDokumentasjonsbehov = søknad.dokumentasjonsbehov;

      if (spørsmål.flersvar) {
        endretDokumentasjonsbehov = hentDokumentasjonTilFlersvarSpørsmål(
          erHuketAv,
          søknad.dokumentasjonsbehov,
          valgtSvar,
          intl
        );
      } else {
        endretDokumentasjonsbehov = oppdaterDokumentasjonTilEtSvarSpørsmål(
          søknad.dokumentasjonsbehov,
          spørsmål,
          valgtSvar,
          intl
        );
      }

      settSøknad((prevSoknad) => {
        return {
          ...prevSoknad,
          dokumentasjonsbehov: endretDokumentasjonsbehov,
        };
      });
    };

    return {
      søknad,
      settSøknad,
      settDokumentasjonsbehov,
      mellomlagretBarnetilsyn,
      hentMellomlagretBarnetilsyn,
      mellomlagreBarnetilsyn,
      brukMellomlagretBarnetilsyn,
      nullstillMellomlagretBarnetilsyn,
    };
  }
);

export { BarnetilsynSøknadProvider, useBarnetilsynSøknad };
