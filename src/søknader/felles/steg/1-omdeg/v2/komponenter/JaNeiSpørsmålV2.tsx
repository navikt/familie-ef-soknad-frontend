import React, { useState } from 'react';
import { VStack } from '@navikt/ds-react';
import { RadioSpørsmål } from './RadioSpørsmål';
import { SpørsmålWrapper } from './SpørsmålWrapper';
import { StegSpørsmål, SvarAlternativ } from './SpørsmålSvarStruktur';

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
    erBesvart: value !== undefined,
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
  const svarAlternativer: SvarAlternativ[] = [
    { id: 'JA', svarKey: 'svar.ja' },
    { id: 'NEI', svarKey: 'svar.nei' },
  ];

  return (
    <VStack gap="6">
      <SpørsmålWrapper spørsmål={spørsmål} lesMerTittel={lesMerTittel} lesMerTekst={lesMerTekst} />

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
