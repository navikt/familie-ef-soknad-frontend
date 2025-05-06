import React, { useContext } from 'react';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
import SøkerErGift from './SøkerErGift';
import { hentBooleanFraValgtSvar } from '../../../../utils/spørsmålogsvar';
import { hentTekst } from '../../../../utils/søknad';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import { usePersonContext } from '../../../../context/PersonContext';
import {
  ESivilstatusSøknadid,
  ISivilstatus,
} from '../../../../models/steg/omDeg/sivilstatus';
import SpørsmålGiftSeparertEllerSkiltIkkeRegistrert from './SpørsmålGiftSeparertEllerSkiltIkkeRegistrert';
import {
  erSøkerGift,
  erSøkerUGiftSkiltSeparertEllerEnke,
} from '../../../../utils/sivilstatus';
import { IMedlemskap } from '../../../../models/steg/omDeg/medlemskap';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import ÅrsakEnslig from './begrunnelse/ÅrsakEnslig';
import { erSivilstandSpørsmålBesvart } from '../../../../helpers/steg/omdeg';
import { GjenbrukContext } from '../../../../context/GjenbrukContext';

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
  const { erUformeltGift, datoFlyttetFraHverandre, datoSøktSeparasjon } =
    sivilstatus;
  const { skalGjenbrukeSøknad } = useContext(GjenbrukContext);

  const gjenbrukerSøknadOgHarUbesvartSeparsjonsspørsmål = () =>
    skalGjenbrukeSøknad && sivilstatus.harSøktSeparasjon === undefined;
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
    if (
      spørsmål.søknadid === ESivilstatusSøknadid.harSøktSeparasjon &&
      !gjenbrukerSøknadOgHarUbesvartSeparsjonsspørsmål()
    ) {
      datoSøktSeparasjon && delete nySivilstatus.datoSøktSeparasjon;
      datoFlyttetFraHverandre && delete nySivilstatus.datoFlyttetFraHverandre;
    }

    settSivilstatus(nySivilstatus);
    settDokumentasjonsbehov(spørsmål, valgtSvar);
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

  return (
    <SeksjonGruppe aria-live="polite">
      {erSøkerGift(sivilstand) && (
        <SøkerErGift
          settJaNeiFelt={settSivilstatusFelt}
          settDato={settDato}
          sivilstatus={sivilstatus}
        />
      )}

      {erSøkerUGiftSkiltSeparertEllerEnke(sivilstand) && (
        <SpørsmålGiftSeparertEllerSkiltIkkeRegistrert
          erUformeltGift={erUformeltGift}
          settSivilstatusFelt={settSivilstatusFelt}
          sivilstatus={sivilstatus}
        />
      )}

      {erSivilstandSpørsmålBesvart(sivilstand, sivilstatus) && (
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
