import React from 'react';
import { VStack } from '@navikt/ds-react';
import { SøknadBanner } from './SøknadBanner';

interface Props {
  tittel: string;
}

export const StegSide: React.FC<Props> = ({ tittel }) => {
  return (
    <VStack gap={'6'}>
      <SøknadBanner bannerTekst={tittel} />
    </VStack>
  );
};
