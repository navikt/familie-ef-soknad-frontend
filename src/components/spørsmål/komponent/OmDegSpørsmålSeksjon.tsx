import React from 'react';
import { VStack } from '@navikt/ds-react';
import { SingleSelectSpørsmål } from './Spørsmål';
import { SingleSelectSpørsmålKomponent } from './spørsmåltyper/SingleSelectSpørsmålKomponent';

const singleSelectSpørsmålJaNei: SingleSelectSpørsmål = {
  id: 'singleSelectSpørsmålJaNei',
  spørsmålTekstKey: 'Jeg er et SingleSelectSpørsmål',

  svarAlternativ: [
    {
      svarVerdi: 'Ja',
      label: 'svar.ja',
    },
    {
      svarVerdi: 'Nei',
      label: 'svar.nei',
    },
  ],
  svarAlternativLayout: 'horizontal',
};

const singleSelectSpørsmålFlereVerdier: SingleSelectSpørsmål = {
  id: 'singleSelectSpørsmålFlereVerdier',
  spørsmålTekstKey: 'Jeg er et SingleSelectSpørsmål med flere verdier',

  svarAlternativ: [
    {
      svarVerdi: 'Verdi 1',
      label: 'Verdi 1',
    },
    {
      svarVerdi: 'Verdi 2',
      label: 'Verdi 2',
    },
    {
      svarVerdi: 'Verdi 3',
      label: 'Verdi 3',
    },
    {
      svarVerdi: 'Verdi 4',
      label: 'Verdi 4',
    },
    {
      svarVerdi: 'Verdi 5',
      label: 'Verdi 5',
    },
  ],
  svarAlternativLayout: 'vertical',
};

export const OmDegSpørsmålSeksjon: React.FC = () => {
  return (
    <VStack gap={'6'}>
      <SingleSelectSpørsmålKomponent
        singleSelectSpørsmål={singleSelectSpørsmålJaNei}
      />

      <SingleSelectSpørsmålKomponent
        singleSelectSpørsmål={singleSelectSpørsmålFlereVerdier}
      />
    </VStack>
  );
};
