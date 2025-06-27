import React from 'react';
import { VStack } from '@navikt/ds-react';
import { UtenlandsperiodeVelger } from './kompleksespørsmål/UtelandsperiodeVelger';

export const OmDegSpørsmålSeksjon: React.FC = () => {
  return (
    <VStack gap={'6'}>
      <UtenlandsperiodeVelger />
    </VStack>
  );
};
