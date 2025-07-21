import React from 'react';
import { VStack } from '@navikt/ds-react';
import { SøkerErGiftV2 } from './SøkerErGiftV2';
import { useOmDegV2 } from '../typer/OmDegContextV2';
import {
  erSøkerGift,
  erSøkerUGiftSkiltSeparertEllerEnke,
} from '../../../../../../utils/sivilstatus';
import { SøkerErSeparertEllerUgift } from './SøkerErSeparertEllerUgift';
import { AleneMedBarnÅrsak } from './begrunnelse/AleneMedBarnÅrsak';
import { erSivilstandSpørsmålBesvartV2 } from './SivilstatusV2Helpers';

export const SivilstatusV2: React.FC = () => {
  const { søker, sivilstatusData } = useOmDegV2();
  const sivilstand = søker.sivilstand;

  const visSøkerErGiftSpørsmål = erSøkerGift(sivilstand);
  const visSøkerErSeparertEllerSkiltSpørsmål = erSøkerUGiftSkiltSeparertEllerEnke(sivilstand);
  const visÅrsakEnsligSpørsmål = erSivilstandSpørsmålBesvartV2(sivilstand, sivilstatusData);

  return (
    <VStack gap={'6'}>
      {visSøkerErGiftSpørsmål && <SøkerErGiftV2 />}
      {visSøkerErSeparertEllerSkiltSpørsmål && <SøkerErSeparertEllerUgift />}
      {visÅrsakEnsligSpørsmål && <AleneMedBarnÅrsak />}
    </VStack>
  );
};
