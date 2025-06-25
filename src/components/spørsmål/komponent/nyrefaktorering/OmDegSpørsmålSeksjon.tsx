import React from 'react';
import { VStack } from '@navikt/ds-react';
import { MedlemskapV2 } from './kompleksespørsmål/MedlemskapV2';

export const OmDegSpørsmålSeksjon: React.FC = () => {
  return (
    <VStack gap={'6'}>
      <MedlemskapV2 />
    </VStack>
  );
};
