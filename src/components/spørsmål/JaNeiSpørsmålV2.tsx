import React from 'react';
import { StegSpørsmål, SvarAlternativ } from '../../models/felles/spørsmålogsvar';
import styles from './YeNeSpørsmål.module.css';
import { Heading, ReadMore, VStack } from '@navikt/ds-react';
import { hentTekst } from '../../utils/søknad';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { RadioSpørsmål } from './RadioSpørsmål';

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
