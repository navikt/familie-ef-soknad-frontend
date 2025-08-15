import React from 'react';
import SøkerErGift from './SøkerErGift';
import { usePersonContext } from '../../../../../context/PersonContext';
import SpørsmålGiftSeparertEllerSkiltIkkeRegistrert from './SpørsmålGiftSeparertEllerSkiltIkkeRegistrert';
import { erSøkerGift, erSøkerUGiftSkiltSeparertEllerEnke } from '../../../../../utils/sivilstatus';
import ÅrsakEnslig from './begrunnelse/ÅrsakEnslig';
import { erSivilstandSpørsmålBesvart } from '../../../../../helpers/steg/omdeg';
import { useOmDeg } from '../OmDegContext';
import { VStack } from '@navikt/ds-react';

export const Sivilstatus: React.FC = () => {
  const { sivilstatus } = useOmDeg();
  const { person } = usePersonContext();
  const sivilstand = person.søker.sivilstand;

  return (
    <VStack gap={'6'}>
      {erSøkerGift(sivilstand) && <SøkerErGift />}

      {erSøkerUGiftSkiltSeparertEllerEnke(sivilstand) && (
        <SpørsmålGiftSeparertEllerSkiltIkkeRegistrert />
      )}

      {erSivilstandSpørsmålBesvart(sivilstand, sivilstatus) && <ÅrsakEnslig />}
    </VStack>
  );
};
