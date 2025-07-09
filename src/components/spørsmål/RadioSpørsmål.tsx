import React from 'react';
import { StegSpørsmål, SvarAlternativ } from '../../models/felles/spørsmålogsvar';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { Box, Radio, RadioGroup } from '@navikt/ds-react';
import { hentTekst } from '../../utils/søknad';
import styles from './RadioSpørsmål.module.css';
import clsx from 'clsx';

export type SvarLayout = 'vertical' | 'horizontal';

export interface Props {
  spørsmål: StegSpørsmål;
  valgtVerdi: SvarAlternativ | undefined;
  svarLayout: SvarLayout;
  onChange: (svar: SvarAlternativ) => void;
}

export const RadioSpørsmål: React.FC<Props> = ({ spørsmål, valgtVerdi, svarLayout, onChange }) => {
  const intl = useLokalIntlContext();
  const spørsmålTekst = hentTekst(spørsmål.spørsmålKey, intl);
  const svarAlternativer = spørsmål.svarAlternativer;

  const handleChange = (valgtSvarId: string) => {
    const valgt = svarAlternativer?.find((svar: SvarAlternativ) => svar.id === valgtSvarId);
    if (valgt) onChange(valgt);
  };

  return (
    <RadioGroup legend={spørsmålTekst} hideLegend value={valgtVerdi?.id} onChange={handleChange}>
      <div
        role="group"
        className={svarLayout === 'vertical' ? styles.stackVertical : styles.stackHorizontal}
      >
        {svarAlternativer?.map((svar) => (
          <Box
            key={svar.id}
            className={clsx(styles.radioBox, {
              [styles.selected]: valgtVerdi?.id === svar.id,
            })}
          >
            <Radio value={svar.id}>{hentTekst(svar.labelKey, intl)}</Radio>
          </Box>
        ))}
      </div>
    </RadioGroup>
  );
};
