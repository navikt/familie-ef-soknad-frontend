import React from 'react';
import { VStack } from '@navikt/ds-react';
import { SøkerErGiftV2 } from './SøkerErGiftV2';

export const SivilstatusV2: React.FC = () => {
  return (
    <VStack gap={'6'}>
      <SøkerErGiftV2 />
    </VStack>
  );
};
