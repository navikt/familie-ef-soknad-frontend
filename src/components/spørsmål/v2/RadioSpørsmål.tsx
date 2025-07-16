import React from 'react';
import { StegSpørsmål, SvarAlternativ } from '../../../models/felles/spørsmålogsvar';
import { useLokalIntlContext } from '../../../context/LokalIntlContext';
import { Radio, RadioGroup } from '@navikt/ds-react';
import { hentTekst } from '../../../utils/søknad';
import styles from './RadioSpørsmål.module.css';
import clsx from 'clsx';

export type SvarLayout = 'vertical' | 'horizontal';

export interface Props {
  spørsmål: StegSpørsmål;
  svarAlternativer: SvarAlternativ[];
  valgtVerdi: SvarAlternativ | undefined;
  svarLayout: SvarLayout;
  onChange: (svar: SvarAlternativ) => void;
}

export const RadioSpørsmål: React.FC<Props> = ({
  spørsmål,
  svarAlternativer,
  valgtVerdi,
  svarLayout,
  onChange,
}) => {
  const intl = useLokalIntlContext();
  const spørsmålTekst = hentTekst(spørsmål.spørsmålKey, intl);

  const handleChange = (valgtSvarId: string) => {
    const valgt = svarAlternativer.find((svar) => svar.id === valgtSvarId);
    if (valgt) onChange(valgt);
  };

  return (
    <RadioGroup legend={spørsmålTekst} hideLegend value={valgtVerdi?.id} onChange={handleChange}>
      <div
        role="group"
        className={svarLayout === 'vertical' ? styles.stackVertical : styles.stackHorizontal}
      >
        {svarAlternativer.map((svar) => {
          const erValgt = valgtVerdi?.id === svar.id;

          return (
            <label
              key={svar.id}
              htmlFor={svar.id}
              className={clsx(styles.radioBox, { [styles.selected]: erValgt })}
            >
              <Radio id={svar.id} value={svar.id} name={spørsmål.spørsmålKey}>
                {hentTekst(svar.labelKey, intl)}
              </Radio>
            </label>
          );
        })}
      </div>
    </RadioGroup>
  );
};
