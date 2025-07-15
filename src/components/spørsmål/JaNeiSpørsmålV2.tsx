import React, { useState } from 'react';
import { StegSpørsmål, SvarAlternativ } from '../../models/felles/spørsmålogsvar';
import styles from './JaNeiSpørsmålV2.module.css';
import { Heading, ReadMore, VStack } from '@navikt/ds-react';
import { hentTekst } from '../../utils/søknad';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { RadioSpørsmål } from './RadioSpørsmål';

export const useJaNeiBoolean = (initialValue?: boolean) => {
  const [value, setValue] = useState<boolean | undefined>(initialValue);

  const svarTilBoolean = (svar: SvarAlternativ): boolean | undefined => {
    return svar.id === 'JA' ? true : svar.id === 'NEI' ? false : undefined;
  };

  const handleChange = (svar: SvarAlternativ) => {
    setValue(svarTilBoolean(svar));
  };

  return {
    value,
    setValue,
    handleChange,
    erJa: value === true,
    erNei: value === false,
    erUbesvart: value === undefined,
  };
};

interface Props {
  spørsmål: StegSpørsmål;
  onChange: (svar: SvarAlternativ) => void;
  lesMerTittel?: string;
  lesMerTekst?: string;
}

export const JaNeiSpørsmålV2: React.FC<Props> = ({
  spørsmål,
  lesMerTittel,
  lesMerTekst,
  onChange,
}) => {
  const intl = useLokalIntlContext();
  const spørsmålTekst = hentTekst(spørsmål.spørsmålKey, intl);

  const svarAlternativer: SvarAlternativ[] = [
    { id: 'JA', labelKey: 'svar.ja' },
    { id: 'NEI', labelKey: 'svar.nei' },
  ];

  return (
    <VStack gap="6">
      <Heading size="xsmall" className={styles.heading}>
        {spørsmålTekst}
      </Heading>

      {lesMerTittel && lesMerTekst && <ReadMore header={lesMerTittel}>{lesMerTekst}</ReadMore>}

      <RadioSpørsmål
        spørsmål={spørsmål}
        svarAlternativer={svarAlternativer}
        valgtVerdi={undefined}
        svarLayout={'horizontal'}
        onChange={onChange}
      />
    </VStack>
  );
};
