import React from 'react';
import { Heading, ReadMore, VStack } from '@navikt/ds-react';
import styles from './SpørsmålWrapper.module.css';

interface Props {
  tittel: string;
  children: React.ReactNode;
  lesMerTittel?: string;
  lesMerTekst?: string;
}

export const SpørsmålWrapper: React.FC<Props> = ({
  tittel,
  children,
  lesMerTittel,
  lesMerTekst,
}) => {
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
