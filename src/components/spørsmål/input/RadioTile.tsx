import React from 'react';
import { Box, Radio, RadioGroup } from '@navikt/ds-react';
import styles from './RadioTile.module.css';

export type RadioTileLayoutDirection = 'vertical' | 'horizontal';

interface Props {
  legend: string;
  svarAlternativer: string[];
  radioTileLayoutDirection: RadioTileLayoutDirection;
}

export const RadioTile: React.FC<Props> = ({
  legend,
  svarAlternativer,
  radioTileLayoutDirection,
}) => {
  return (
    <RadioGroup legend={legend} hideLegend>
      <div
        className={
          radioTileLayoutDirection === 'vertical' ? styles.stackVertical : styles.stackHorizontal
        }
      >
        {svarAlternativer.map((verdi) => (
          <Box
            key={verdi}
            className={styles.radioBox}
            onClick={() => {}} // TODO: Fix
            role="radio"
          >
            <Radio value={verdi}>{verdi}</Radio>
          </Box>
        ))}
      </div>
    </RadioGroup>
  );
};
