import React from 'react';
import { Box, Radio, RadioGroup } from '@navikt/ds-react';
import styles from './RadioTile.module.css';
import clsx from 'clsx';

export type RadioTileLayoutDirection = 'vertical' | 'horizontal';

interface Props {
  legend: string;
  svarAlternativer: string[];
  radioTileLayoutDirection: RadioTileLayoutDirection;
  valgtVerdi: string | null;
  onChange: (verdi: string) => void;
}

export const RadioTile: React.FC<Props> = ({
  legend,
  svarAlternativer,
  radioTileLayoutDirection,
  valgtVerdi,
  onChange,
}) => {
  return (
    <RadioGroup
      legend={legend}
      hideLegend
      value={valgtVerdi || undefined}
      onChange={(verdi: string) => onChange(verdi)}
    >
      <div
        className={
          radioTileLayoutDirection === 'vertical' ? styles.stackVertical : styles.stackHorizontal
        }
      >
        {svarAlternativer.map((verdi) => (
          <Box
            key={verdi}
            className={clsx(styles.radioBox, {
              [styles.selected]: valgtVerdi === verdi,
            })}
            onClick={() => onChange(verdi)}
          >
            <Radio value={verdi}>{verdi}</Radio>
          </Box>
        ))}
      </div>
    </RadioGroup>
  );
};
