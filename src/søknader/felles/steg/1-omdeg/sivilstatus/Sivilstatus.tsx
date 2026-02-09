import React from 'react';
import { SøkerErGift } from './SøkerErGift';
import { usePersonContext } from '../../../../../context/PersonContext';
import { SpørsmålGiftSeparertEllerSkiltIkkeRegistrert } from './SpørsmålGiftSeparertEllerSkiltIkkeRegistrert';
import { erSøkerGift, erSøkerUGiftSkiltSeparertEllerEnke } from '../../../../../utils/sivilstatus';
import { ÅrsakEnslig } from './begrunnelse/ÅrsakEnslig';
import { erSivilstandSpørsmålBesvart } from '../../../../../helpers/steg/omdeg';
import { useOmDeg } from '../OmDegContext';
import { VStack } from '@navikt/ds-react';

export const Sivilstatus: React.FC = () => {
  const { sivilstatus } = useOmDeg();
  const { person } = usePersonContext();
  const sivilstand = person.søker.sivilstand;

  const visSøkerErGift = erSøkerGift(sivilstand);
  const visGiftSeparertEllerSkiltIkkeRegistrert = erSøkerUGiftSkiltSeparertEllerEnke(sivilstand);
  const visÅrsakEnslig = erSivilstandSpørsmålBesvart(sivilstand, sivilstatus);

  return (
    <VStack gap={'space-24'}>
      {visSøkerErGift && <SøkerErGift />}
      {visGiftSeparertEllerSkiltIkkeRegistrert && <SpørsmålGiftSeparertEllerSkiltIkkeRegistrert />}
      {visÅrsakEnslig && <ÅrsakEnslig />}
    </VStack>
  );
};
