import React from 'react';
import { Radio, RadioGroup, Stack } from '@navikt/ds-react';
import styles from './AkselSpørsmål.module.css';

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
          <label key={svar} className={styles.radioBox}>
            <Radio value={svar}>{svar}</Radio>
          </label>
        ))}
      </Stack>
    </RadioGroup>
  );
};
