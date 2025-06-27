import React from 'react';
import { VStack } from '@navikt/ds-react';
import { Utelandsperiode } from './kompleksespørsmål/Utelandsperiode';

export const OmDegSpørsmålSeksjon: React.FC = () => {
  return (
    <VStack gap={'6'}>
      <Utelandsperiode />
    </VStack>
  );
};
