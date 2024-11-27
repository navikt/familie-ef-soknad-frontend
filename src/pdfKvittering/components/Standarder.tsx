import React from 'react';
import { Standard } from './Standard';
import { VStack } from '@navikt/ds-react';

export type StandardTyper =
  | 'ua1'
  | 'ua2'
  | '1a'
  | '1b'
  | '2a'
  | '2b'
  | '2u'
  | '3a'
  | '3b'
  | '3u'
  | '4'
  | '4f'
  | '4e';

export type Standarder = {
  [key in StandardTyper]: Standard;
};

interface StandarderProps {
  standarder: Standarder;
}

export function Standarder({ standarder }: StandarderProps) {
  return (
    <VStack>
      {Object.entries(standarder).map(([standardType, standard]) => {
        return (
          <Standard
            key={standardType}
            standardType={standardType}
            standard={standard}
          />
        );
      })}
    </VStack>
  );
}
