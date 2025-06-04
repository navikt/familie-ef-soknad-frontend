import React from 'react';
import { VStack } from '@navikt/ds-react';
import { borDuPåDenneAdressenSpørsmål } from '../../../../søknad/steg/1-omdeg/spørsmål/borDuPåDenneAdressenSpørsmål';
import { SpørsmålRenderer } from './SpørsmålRenderer';

export const OmDegSpørsmålSeksjon: React.FC = () => {
  return (
    <VStack gap="8">
      <SpørsmålRenderer spørsmål={borDuPåDenneAdressenSpørsmål} />
    </VStack>
  );
};
