import React from 'react';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { Heading, ReadMore, VStack } from '@navikt/ds-react';
import { hentHTMLTekst, hentTekst } from '../../utils/teksthåndtering';

interface Props {
  spørsmålKey: string;
  lesMerHeaderKey?: string;
  lesMerDescriptionKey?: string;
  children?: React.ReactNode;
}

export const SpørsmålWrapper: React.FC<Props> = ({
  spørsmålKey,
  lesMerHeaderKey,
  lesMerDescriptionKey,
  children,
}) => {
  const intl = useLokalIntlContext();

  const visLesMer = lesMerHeaderKey !== undefined && lesMerDescriptionKey !== undefined;

  return (
    <VStack gap={'6'}>
      <VStack gap={'2'}>
        <Heading size={'xsmall'}>{hentTekst(spørsmålKey, intl)}</Heading>

        {visLesMer && (
          <ReadMore header={hentTekst(lesMerHeaderKey, intl)}>
            {hentHTMLTekst(lesMerDescriptionKey, intl)}
          </ReadMore>
        )}
      </VStack>

      {children}
    </VStack>
  );
};
