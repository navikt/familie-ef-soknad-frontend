import React from 'react';
import { Heading, ReadMore, VStack } from '@navikt/ds-react';
import styles from './SpørsmålWrapper.module.css';

export const SpørsmålWrapper: React.FC<{
  tittel: string;
  lesMerTittel?: string;
  lesMerTekst?: string;
  children: React.ReactNode;
}> = ({ tittel, lesMerTittel, lesMerTekst, children }) => {
  return (
    <VStack gap="6">
      <Heading size="xsmall" className={styles.heading}>
        {tittel}
      </Heading>

      {lesMerTittel && lesMerTekst && <ReadMore header={lesMerTittel}>{lesMerTekst}</ReadMore>}

      {children}
    </VStack>
  );
};
