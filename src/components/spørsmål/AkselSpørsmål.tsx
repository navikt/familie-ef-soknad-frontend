import React from 'react';
import { Box, VStack, Heading, RadioGroup, Radio } from '@navikt/ds-react';

type SvarVerdi = string;

export interface Props {
  id: string;
  spørsmål: string;
  svaralternativer: SvarVerdi[];
  verdi?: SvarVerdi;
  onChange: (spørsmålId: string, verdi: SvarVerdi) => void;
}

export const AkselSpørsmål: React.FC<Props> = ({
  id,
  spørsmål,
  svaralternativer,
  verdi,
  onChange,
}) => {
  return (
    <VStack gap="4" align="start" width="100%">
      <Heading size="xsmall">{spørsmål}</Heading>
      <RadioGroup
        legend=""
        value={verdi}
        onChange={(val: SvarVerdi) => onChange(id, val)}
      >
        <VStack gap="4" width="100%">
          {svaralternativer.map((svar) => (
            <Box
              key={svar}
              background="bg-default"
              borderColor="border-alt-1"
              paddingInline="space-16"
              paddingBlock="space-4"
              borderWidth="1"
              borderRadius="medium"
              flexGrow="1"
            >
              <Radio value={svar}>{svar}</Radio>
            </Box>
          ))}
        </VStack>
      </RadioGroup>
    </VStack>
  );
};
