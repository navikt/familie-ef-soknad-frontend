import React from 'react';
import { VStack } from '@navikt/ds-react';
import { SpørsmålKomponent } from './SpørsmålKomponent';
import { BaseSpørsmål } from './Spørsmål';

const likerDuBananerSpørsmål: BaseSpørsmål = {
  id: 'likerDuBananer',
  spørsmålTekstKey: 'Liker du bananer?',
};

const likerDuLesMerTeksterSpørsmål: BaseSpørsmål = {
  id: 'likerDuLesMerTekster',
  spørsmålTekstKey: 'Liker du les mer tekster?',

  lesMerTittelKey: 'Hvorfor spør vi?',
  lesMerTekstKey:
    'Vi spør fordi vi må. Dette er litt fordi vi digger folk som liker frukt!',
};

const likerDuAlertsSpørsmål: BaseSpørsmål = {
  id: 'likerDuAlerts',
  spørsmålTekstKey: 'Liker du alerts?',

  alerts: [
    {
      id: 'alertSomAlltidVises',
      alertTekstKey: 'Hey! Jeg er en alert som alltid vises!',
      alertVariant: 'info',
      skalAlltidVises: true,
    },
    {
      id: 'alertSomVisesVedJa',
      alertTekstKey: 'Jeg er en alert som vises når man svarer "Ja".',
      alertVariant: 'info',
      visAlertNår: ({ valgtSvar }) => valgtSvar === 'Ja',
    },
    {
      id: 'alertSomVisesVedNei',
      alertTekstKey: 'Jeg er en alert som vises når man svarer "Nei".',
      alertVariant: 'warning',
      visAlertNår: ({ valgtSvar }) => valgtSvar === 'Nei',
    },
    {
      id: 'alertSomVisesUansett',
      alertTekstKey: 'Jeg vises så lenge du har valgt noe!',
      alertVariant: 'success',
      visAlertNår: ({ valgtSvar }) => valgtSvar !== null,
    },
  ],
};

export const OmDegSpørsmålSeksjon: React.FC = () => {
  return (
    <VStack gap={'6'}>
      <SpørsmålKomponent spørsmål={likerDuBananerSpørsmål} />

      <SpørsmålKomponent spørsmål={likerDuLesMerTeksterSpørsmål} />

      <SpørsmålKomponent spørsmål={likerDuAlertsSpørsmål} />
    </VStack>
  );
};
