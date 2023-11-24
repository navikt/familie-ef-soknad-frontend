import React from 'react';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
import SøkerErGift from './SøkerErGift';
import ÅrsakEnslig from './begrunnelse/ÅrsakEnslig';
import { hentBooleanFraValgtSvar } from '../../../../utils/spørsmålogsvar';
import { hentTekst } from '../../../../utils/søknad';
import {
  ESvar,
  ISpørsmål,
  ISvar,
} from '../../../../models/felles/spørsmålogsvar';
import { usePersonContext } from '../../../../context/PersonContext';
import {
  ESivilstatusSøknadid,
  ISivilstatus,
} from '../../../../models/steg/omDeg/sivilstatus';
import SøkerErUgift from './SøkerErUgift';
import {
  erSøkerEnke,
  erSøkerGift,
  erSøkerSeparert,
  erSøkerSkilt,
  erSøkerUgift,
} from '../../../../utils/sivilstatus';
import { IMedlemskap } from '../../../../models/steg/omDeg/medlemskap';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import SøkerErSkilt from './SøkerErSkilt';

interface Props {
  sivilstatus: ISivilstatus;
  settSivilstatus: (sivilstatus: ISivilstatus) => void;
  settMedlemskap: (medlemskap: IMedlemskap) => void;
  settDokumentasjonsbehov: (
    spørsmål: ISpørsmål,
    valgtSvar: ISvar,
    erHuketAv?: boolean
  ) => void;
}

const Sivilstatus: React.FC<Props> = ({
  sivilstatus,
  settSivilstatus,
  settDokumentasjonsbehov,
  settMedlemskap,
}) => {
  const intl = useLokalIntlContext();
  const { person } = usePersonContext();
  const sivilstand = person.søker.sivilstand;

  const {
    harSøktSeparasjon,
    erUformeltSeparertEllerSkilt,
    erUformeltGift,
    datoFlyttetFraHverandre,
    datoSøktSeparasjon,
  } = sivilstatus;

  const harSvartPåGiftUtenRegistrertSpørsmål =
    sivilstatus.erUformeltGift?.svarid === ESvar.JA ||
    sivilstatus.erUformeltGift?.svarid === ESvar.NEI;

  const settSivilstatusFelt = (spørsmål: ISpørsmål, valgtSvar: ISvar) => {
    const spørsmålLabel = hentTekst(spørsmål.tekstid, intl);
    const svar: boolean = hentBooleanFraValgtSvar(valgtSvar);

    const nySivilstatus = {
      ...sivilstatus,
      [spørsmål.søknadid]: {
        spørsmålid: spørsmål.søknadid,
        svarid: valgtSvar.id,
        label: spørsmålLabel,
        verdi: svar,
      },
    };
    if (spørsmål.søknadid === ESivilstatusSøknadid.harSøktSeparasjon) {
      datoSøktSeparasjon && delete nySivilstatus.datoSøktSeparasjon;
      datoFlyttetFraHverandre && delete nySivilstatus.datoFlyttetFraHverandre;
    }

    settSivilstatus(nySivilstatus);
    settDokumentasjonsbehov(spørsmål, valgtSvar);
    settMedlemskap({});
  };

  const settDato = (
    date: string,
    objektnøkkel: string,
    tekstid: string
  ): void => {
    settSivilstatus({
      ...sivilstatus,
      [objektnøkkel]: {
        label: intl.formatMessage({ id: tekstid }),
        verdi: date,
      },
    });
  };

  const harFyltUtSeparasjonSomGift = () => {
    if (harSøktSeparasjon === undefined || harSøktSeparasjon === null)
      return false;

    if (harSøktSeparasjon.verdi === true) {
      return !!datoSøktSeparasjon?.verdi;
    } else {
      return true;
    }
  };

  return (
    <SeksjonGruppe aria-live="polite">
      {erSøkerGift(sivilstand) && (
        <SøkerErGift
          settJaNeiFelt={settSivilstatusFelt}
          settDato={settDato}
          sivilstatus={sivilstatus}
        />
      )}

      {erSøkerUgift(sivilstand) && (
        <SøkerErUgift
          erUformeltGift={erUformeltGift}
          settSivilstatusFelt={settSivilstatusFelt}
          sivilstatus={sivilstatus}
        />
      )}

      {erSøkerSkilt(sivilstand) && (
        <SøkerErSkilt
          settSivilstatusFelt={settSivilstatusFelt}
          sivilstatus={sivilstatus}
        />
      )}

      {(erSøkerUgift(sivilstand) &&
        erUformeltSeparertEllerSkilt?.hasOwnProperty('verdi') &&
        harSvartPåGiftUtenRegistrertSpørsmål) ||
      (erSøkerGift(sivilstand) && harFyltUtSeparasjonSomGift()) ||
      erSøkerSeparert(sivilstand) ||
      (erSøkerSkilt(sivilstand) && harSvartPåGiftUtenRegistrertSpørsmål) ||
      erSøkerEnke(sivilstand) && (
        <ÅrsakEnslig
          sivilstatus={sivilstatus}
          settSivilstatus={settSivilstatus}
          settDato={settDato}
          settDokumentasjonsbehov={settDokumentasjonsbehov}
          settMedlemskap={settMedlemskap}
        />
      )}
    </SeksjonGruppe>
  );
};

export default Sivilstatus;
