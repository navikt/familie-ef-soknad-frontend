import { hentTekst } from '../../../../../utils/søknad';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { RadioGroup, Radio } from '@navikt/ds-react';
import clsx from 'clsx';
import styles from './RadioInput.module.css';
import React from 'react';

interface Props {
  spørsmålId: string;
  svarAlternativer: string[];
  svarAlternativRetning: string;
  verdi: string;
  onChange: (value: string) => void;
}

export const RadioInputKomponent: React.FC<Props> = ({
  spørsmålId,
  svarAlternativer,
  svarAlternativRetning,
  verdi,
  onChange,
}) => {
  const intl = useLokalIntlContext();
  // Denne trengs selv om RadioGroup legend er gjemt, slik at tekstlesere fortsatt skjønner kontekst til valgene.
  // Se Aksel -> https://aksel.nav.no/komponenter/core/radio
  const spørsmålTekst = hentTekst(spørsmålId, intl);

  return (
    <RadioGroup
      legend={spørsmålTekst}
      value={verdi}
      onChange={onChange}
      name={spørsmålId}
      hideLegend={true}
    >
      <div
        className={clsx({
          [styles.stackHorizontal]: svarAlternativRetning === 'horizontal',
          [styles.stackVertical]: svarAlternativRetning === 'vertical',
        })}
      >
        {svarAlternativer.map((alternativ) => (
          <Radio key={alternativ} value={alternativ}>
            {alternativ}
          </Radio>
        ))}
      </div>
    </RadioGroup>
  );
};
