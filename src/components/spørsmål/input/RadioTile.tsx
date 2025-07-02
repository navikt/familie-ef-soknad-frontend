import React, { useState } from 'react';
import { Box, Radio, RadioGroup } from '@navikt/ds-react';
import styles from './RadioTile.module.css';
import clsx from 'clsx';

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
  const [valgtVerdi, settValgtVerdi] = useState<string | null>(null);

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
            className={clsx(styles.radioBox, {
              [styles.selected]: valgtVerdi === verdi,
            })}
            onClick={() => settValgtVerdi(verdi)}
          >
            <Radio value={verdi} checked={valgtVerdi === verdi}>
              {verdi}
            </Radio>
          </Box>
        ))}
      </div>
    </RadioGroup>
  );
};
