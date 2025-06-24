import React from 'react';
import { PersonopplysningerV2 } from './kompleksespørsmål/PersonopplysningerV2';
import { VStack } from '@navikt/ds-react';
import { HvorforErDuAleneMedBarn } from './kompleksespørsmål/HvorforErDuAleneMedBarn';

export const OmDegSpørsmålSeksjon: React.FC = () => {
  return (
    <VStack gap={'6'}>
      <PersonopplysningerV2 />
      <HvorforErDuAleneMedBarn />
    </VStack>
  );
};
