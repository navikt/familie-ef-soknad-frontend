import React from 'react';
import { Alert, Heading, ReadMore, VStack } from '@navikt/ds-react';

export interface Props {
  headingOverskrift: string;
  alertTekst?: string;
  lesMerTittel?: string;
  lesMerTekst?: string;
}

export const SpørsmålHeader: React.FC<Props> = ({
  headingOverskrift,
  alertTekst,
  lesMerTittel,
  lesMerTekst,
}) => {
  const visAlert = !!alertTekst?.trim();
  const visLesMer = !!lesMerTittel?.trim() && !!lesMerTekst?.trim();

  return (
    <VStack align={'start'} gap={'4'}>
      <Heading size="xsmall">{headingOverskrift}</Heading>

      {visAlert && (
        <Alert variant="info" inline>
          {alertTekst}
        </Alert>
      )}

      {visLesMer && <ReadMore header={lesMerTittel}>{lesMerTekst}</ReadMore>}
    </VStack>
  );
};
