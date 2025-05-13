import React from 'react';
import { BodyShort, Heading, VStack } from '@navikt/ds-react';

interface OmDegFelles {
  personIdent: string | null;
  statsborgerskap: string | null;
  sivilstatus: string;
  adresse: string | null;
}

export const OmDegFelles: React.FC<OmDegFelles> = ({
  personIdent,
  statsborgerskap,
  sivilstatus,
  adresse,
}) => {
  return (
    <VStack gap={'4'}>
      <VStack align={'start'}>
        <Heading size="xsmall">Fødselsnummer eller d-nummer</Heading>
        <BodyShort size="medium" weight="regular">
          {personIdent}
        </BodyShort>
      </VStack>
      <VStack align={'start'}>
        <Heading size="xsmall">Statsborgerskap</Heading>
        <BodyShort size="medium" weight="regular">
          {statsborgerskap}
        </BodyShort>
      </VStack>
      <VStack align={'start'}>
        <Heading size="xsmall">Sivilstatus</Heading>
        <BodyShort size="medium" weight="regular">
          {sivilstatus}
        </BodyShort>
      </VStack>
      <VStack align={'start'}>
        <Heading size="xsmall">Adresse</Heading>
        <BodyShort size="medium" weight="regular">
          {adresse}
        </BodyShort>
      </VStack>
    </VStack>
  );
};
