import React from 'react';
import { Box, Radio, RadioGroup, Stack } from '@navikt/ds-react';

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
    <RadioGroup
      legend={spørsmål}
      value={verdi}
      onChange={(val: SvarVerdi) => onChange(id, val)}
    >
      <Stack gap="0 6" direction={{ xs: 'column', sm: 'row' }} wrap={false}>
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
      </Stack>
    </RadioGroup>
  );
};
