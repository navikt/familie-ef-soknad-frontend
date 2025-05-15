import React from 'react';
import { Box, HStack, Radio, VStack, Heading } from '@navikt/ds-react';

export const AkselSpørsmål: React.FC = () => {
  return (
    <VStack gap={'4'} flexGrow={'1'} align={'start'} width="100%">
      <Heading size="xsmall">Bor du på denne adressen?</Heading>
      <HStack gap={'4'} width="100%">
        <Box
          background="bg-default"
          borderColor="border-alt-1"
          paddingInline="space-16"
          paddingBlock="space-4"
          borderWidth="1"
          borderRadius="medium"
          flexGrow={'1'}
        >
          <Radio value="Ja">Ja</Radio>
        </Box>
        <Box
          background="bg-default"
          borderColor="border-alt-1"
          paddingInline="space-16"
          paddingBlock="space-4"
          borderWidth="1"
          borderRadius="medium"
          flexGrow={'1'}
        >
          <Radio value="Nei">Nei</Radio>
        </Box>
      </HStack>
    </VStack>
  );
};
