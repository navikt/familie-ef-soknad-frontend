import React, { useState } from 'react';
import { VStack } from '@navikt/ds-react';
import { RadioQuestion } from './RadioQuestion';

export const RadioTestSection: React.FC = () => {
  const [addressAnswer, setAddressAnswer] = useState<string | undefined>();
  const [reasonAnswer, setReasonAnswer] = useState<string | undefined>();

  return (
    <VStack gap="6">
      <RadioQuestion
        question="Bor du på denne adressen?"
        options={[
          { label: 'Ja', value: 'Ja' },
          { label: 'Nei', value: 'Nei' },
        ]}
        value={addressAnswer}
        onChange={setAddressAnswer}
        direction="horizontal"
      />

      <RadioQuestion
        question="Hvorfor er du alene med barn?"
        options={[
          { label: 'Samlivsbrudd med noen andre', value: 'samlivsbrudd-andre' },
          {
            label: 'Samlivsbrudd med den andre forelderen',
            value: 'samlivsbrudd-forelder',
          },
          { label: 'Endring i omsorgen for barn', value: 'endring-omsorg' },
          {
            label: 'Jeg er alene med barn fra fødsel',
            value: 'alene-fra-fodsel',
          },
          {
            label: 'Jeg er alene med barn på grunn av dødsfall',
            value: 'alene-dodsfall',
          },
        ]}
        value={reasonAnswer}
        onChange={setReasonAnswer}
        direction="vertical"
      />
    </VStack>
  );
};
