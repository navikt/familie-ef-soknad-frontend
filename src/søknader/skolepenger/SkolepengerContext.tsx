import { useEffect, useState } from 'react';
import createUseContext from 'constate';
import tomPerson from '../../mock/initialState.json';
import { EBosituasjon } from '../../models/steg/bosituasjon';
import { ISpørsmål, ISvar } from '../../models/felles/spørsmålogsvar';
import {
  hentDokumentasjonTilFlersvarSpørsmål,
  oppdaterDokumentasjonTilEtSvarSpørsmål,
  oppdaterDokumentasjonTilEtSvarSpørsmålForBarn,
} from '../../helpers/steg/dokumentasjon';
import { MellomlagretSøknadSkolepenger } from './models/mellomlagretSøknad';
import Environment from '../../Environment';
import { hentUid } from '../../utils/autentiseringogvalidering/uuid';
import { nyttTekstFelt } from '../../helpers/tommeSøknadsfelter';
import { SøknadSkolepenger } from './models/søknad';
import {
  hentMellomlagretSøknadFraDokument,
  hentTekst,
  mellomlagreSøknadTilDokument,
  nullstillMellomlagretSøknadTilDokument,
} from '../../utils/søknad';
import { MellomlagredeStønadstyper } from '../../models/søknad/stønadstyper';
import {
  DokumentasjonUtdanning,
  DokumentasjonUtgifterUtdanning,
} from '../felles/steg/5-aktivitet/AktivitetConfig';
import { IPerson } from '../../models/søknad/person';
import { IBarn } from '../../models/steg/barn';
import { useSpråkContext } from '../../context/SpråkContext';
import { LokalIntlShape } from '../../language/typer';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { oppdaterBarneliste, oppdaterBarnIBarneliste } from '../../utils/barn';
import { LocaleType } from '../../language/typer';

// -----------  CONTEXT  -----------
const initialState = (intl: LokalIntlShape): SøknadSkolepenger => {
  return {
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
    utdanning: {
      id: hentUid(),
      skoleUtdanningssted: nyttTekstFelt,
    },
    dokumentasjonsbehov: [
      {
        ...DokumentasjonUtgifterUtdanning,
        label: hentTekst(DokumentasjonUtgifterUtdanning.tittel, intl),
      },
      {
        ...DokumentasjonUtdanning,
        label: hentTekst(DokumentasjonUtdanning.tittel, intl),
        beskrivelse: 'dokumentasjon.utdanning.beskrivelse.skolepenger',
      },
    ],
    harBekreftet: false,
    locale: '',
  };
};

const [SkolepengerSøknadProvider, useSkolepengerSøknad] = createUseContext(
  () => {
    const intl = useLokalIntlContext();
    SkolepengerSøknadProvider.displayName = 'SKOLEPENGER_PROVIDER';
    const [locale, setLocale] = useSpråkContext();
    const [søknad, settSøknad] = useState<SøknadSkolepenger>(
      initialState(intl)
    );

    const [mellomlagretSkolepenger, settMellomlagretSkolepenger] =
      useState<MellomlagretSøknadSkolepenger>();

    useEffect(() => {
      if (
        mellomlagretSkolepenger?.locale &&
        mellomlagretSkolepenger?.locale !== locale
      ) {
        setLocale(mellomlagretSkolepenger.locale as LocaleType);
      }
    }, [mellomlagretSkolepenger, locale, setLocale]);

    const hentMellomlagretSkolepenger = (): Promise<void> => {
      return hentMellomlagretSøknadFraDokument<MellomlagretSøknadSkolepenger>(
        MellomlagredeStønadstyper.skolepenger
      ).then((mellomlagretVersjon?: MellomlagretSøknadSkolepenger) => {
        if (mellomlagretVersjon) {
          settMellomlagretSkolepenger(mellomlagretVersjon);
        }
      });
    };

    const brukMellomlagretSkolepenger = () => {
      if (mellomlagretSkolepenger) {
        settSøknad(mellomlagretSkolepenger.søknad);
      }
    };

    const mellomlagreSkolepenger = (steg: string) => {
      const utfyltSøknad = {
        søknad: søknad,
        modellVersjon: Environment().modellVersjon.skolepenger,
        gjeldendeSteg: steg,
        locale: locale,
      };
      mellomlagreSøknadTilDokument(
        utfyltSøknad,
        MellomlagredeStønadstyper.skolepenger
      );
      settMellomlagretSkolepenger(utfyltSøknad);
    };

    const nullstillMellomlagretSkolepenger = (): Promise<string> => {
      return nullstillMellomlagretSøknadTilDokument(
        MellomlagredeStønadstyper.skolepenger
      );
    };

    const nullstillSøknadSkolepenger = (
      person: IPerson,
      barnMedLabels: IBarn[]
    ) => {
      settSøknad({
        ...initialState(intl),
        person: { ...person, barn: barnMedLabels },
      });
      settMellomlagretSkolepenger(undefined);
    };

    const settDokumentasjonsbehovForBarn = (
      spørsmål: ISpørsmål,
      valgtSvar: ISvar,
      barneid: string,
      barnepassid?: string
    ) => {
      let endretDokumentasjonsbehov = søknad.dokumentasjonsbehov;
      if (spørsmål.flersvar) {
        console.error('Ikke implementert');
      } else {
        endretDokumentasjonsbehov =
          oppdaterDokumentasjonTilEtSvarSpørsmålForBarn(
            søknad.dokumentasjonsbehov,
            spørsmål,
            valgtSvar,
            intl,
            barneid,
            barnepassid
          );
      }

      settSøknad((prevSoknad) => {
        return {
          ...prevSoknad,
          dokumentasjonsbehov: endretDokumentasjonsbehov,
        };
      });
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

    const oppdaterBarnISøknaden = (oppdatertBarn: IBarn) => {
      settSøknad((prevSøknad) => ({
        ...prevSøknad,
        person: {
          ...prevSøknad.person,
          barn: oppdaterBarnIBarneliste(prevSøknad.person.barn, oppdatertBarn),
        },
      }));
    };

    const oppdaterFlereBarnISøknaden = (oppdaterteBarn: IBarn[]) => {
      settSøknad((prevSøknad) => ({
        ...prevSøknad,
        person: {
          ...prevSøknad.person,
          barn: oppdaterBarneliste(prevSøknad.person.barn, oppdaterteBarn),
        },
      }));
    };

    const fjernBarnFraSøknad = (id: string) => {
      const nyBarneListe = søknad.person.barn.filter(
        (barn: IBarn) => barn.id !== id
      );

      settSøknad((prevSoknad: SøknadSkolepenger) => {
        return {
          ...prevSoknad,
          person: { ...søknad.person, barn: nyBarneListe },
        };
      });
    };

    return {
      søknad,
      settSøknad,
      settDokumentasjonsbehov,
      settDokumentasjonsbehovForBarn,
      mellomlagretSkolepenger,
      hentMellomlagretSkolepenger,
      mellomlagreSkolepenger,
      brukMellomlagretSkolepenger,
      nullstillMellomlagretSkolepenger,
      nullstillSøknadSkolepenger,
      fjernBarnFraSøknad,
      oppdaterBarnISøknaden,
      oppdaterFlereBarnISøknaden,
    };
  }
);

export { SkolepengerSøknadProvider, useSkolepengerSøknad };
