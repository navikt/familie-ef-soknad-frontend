import React from 'react';
import SeksjonGruppe from '../../../../../components/gruppe/SeksjonGruppe';
import SøkerErGift from './SøkerErGift';
import { usePersonContext } from '../../../../../context/PersonContext';
import SpørsmålGiftSeparertEllerSkiltIkkeRegistrert from './SpørsmålGiftSeparertEllerSkiltIkkeRegistrert';
import {
  erSøkerGift,
  erSøkerUGiftSkiltSeparertEllerEnke,
} from '../../../../../utils/sivilstatus';
import ÅrsakEnslig from './begrunnelse/ÅrsakEnslig';
import { erSivilstandSpørsmålBesvart } from '../../../../../helpers/steg/omdeg';
import { useOmDeg } from '../OmDegContext';

const Sivilstatus: React.FC = () => {
  const { sivilstatus } = useOmDeg();
  const { person } = usePersonContext();
  const sivilstand = person.søker.sivilstand;

  return (
    <SeksjonGruppe aria-live="polite">
      {erSøkerGift(sivilstand) && <SøkerErGift />}

      {erSøkerUGiftSkiltSeparertEllerEnke(sivilstand) && (
        <SpørsmålGiftSeparertEllerSkiltIkkeRegistrert />
      )}

      {erSivilstandSpørsmålBesvart(sivilstand, sivilstatus) && <ÅrsakEnslig />}
    </SeksjonGruppe>
  );
};

export default Sivilstatus;
