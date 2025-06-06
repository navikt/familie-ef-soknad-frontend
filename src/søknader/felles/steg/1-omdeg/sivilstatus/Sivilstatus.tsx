import React from 'react';
import SeksjonGruppe from '../../../../../components/gruppe/SeksjonGruppe';
import SøkerErGift from './SøkerErGift';
import { usePersonContext } from '../../../../../context/PersonContext';
import SpørsmålGiftSeparertEllerSkiltIkkeRegistrert from './SpørsmålGiftSeparertEllerSkiltIkkeRegistrert';
import {
  erSøkerGift,
  erSøkerUGiftSkiltSeparertEllerEnke,
} from '../../../../../utils/sivilstatus';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import ÅrsakEnslig from './begrunnelse/ÅrsakEnslig';
import { erSivilstandSpørsmålBesvart } from '../../../../../helpers/steg/omdeg';
import { useOmDeg } from '../OmDegContext';

const Sivilstatus: React.FC = () => {
  const intl = useLokalIntlContext();
  const { sivilstatus, settSivilstatus, settDokumentasjonsbehov } = useOmDeg();
  const { person } = usePersonContext();
  const sivilstand = person.søker.sivilstand;

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
      {erSøkerGift(sivilstand) && <SøkerErGift />}

      {erSøkerUGiftSkiltSeparertEllerEnke(sivilstand) && (
        <SpørsmålGiftSeparertEllerSkiltIkkeRegistrert />
      )}

      {erSivilstandSpørsmålBesvart(sivilstand, sivilstatus) && (
        <ÅrsakEnslig
          sivilstatus={sivilstatus}
          settSivilstatus={settSivilstatus}
          settDato={settDato}
          settDokumentasjonsbehov={settDokumentasjonsbehov}
        />
      )}
    </SeksjonGruppe>
  );
};

export default Sivilstatus;
