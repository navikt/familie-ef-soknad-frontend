import React from 'react';
import { Box, Radio, RadioGroup } from '@navikt/ds-react';
import styles from './SingleSelectSpørsmålKomponent.module.css';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../../utils/søknad';
import { SingleSelectSpørsmål } from '../Spørsmål';
import clsx from 'clsx';
import { SpørsmålWrapper } from '../SpørsmålWrapper';

export const SingleSelectSpørsmålKomponent: React.FC<{
  spørsmål: SingleSelectSpørsmål;
  valgtSvar: string | null;
  onChangeSvar: (val: string) => void;
}> = ({ spørsmål, valgtSvar, onChangeSvar }) => {
  const intl = useLokalIntlContext();

  return (
    <SpørsmålWrapper spørsmål={spørsmål} valgtSvar={valgtSvar}>
      <RadioGroup
        legend={hentTekst(spørsmål.spørsmålTekstKey, intl)}
        hideLegend
        value={valgtSvar}
        onChange={(val) => onChangeSvar(val)}
      >
        <div
          className={clsx({
            [styles.stackHorizontal]:
              spørsmål.svarAlternativLayout === 'horizontal',
            [styles.stackVertical]:
              spørsmål.svarAlternativLayout === 'vertical',
          })}
        >
          {spørsmål.svarAlternativ.map((alternativ) => (
            <Box
              key={alternativ.svarVerdi}
              className={clsx(
                styles.radioBox,
                valgtSvar === alternativ.svarVerdi && styles.selected
              )}
            >
              <Radio value={alternativ.svarVerdi}>
                {hentTekst(alternativ.label, intl)}
              </Radio>
            </Box>
          ))}
        </div>
      </RadioGroup>
    </SpørsmålWrapper>
  );
};
