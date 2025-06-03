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
      id: 'sivilstatus.alert.erUformeltGift',
      alertTekstKey: 'sivilstatus.alert.erUformeltGift',
      alertVariant: 'info',
      skalAlltidVises: true,
    },
  ],
};

export const OmDegSpørsmålSeksjon: React.FC = () => {
  return (
    <VStack gap={'4'}>
      <SpørsmålKomponent spørsmål={likerDuBananerSpørsmål} />

      <SpørsmålKomponent spørsmål={likerDuLesMerTeksterSpørsmål} />

      <SpørsmålKomponent spørsmål={likerDuAlertsSpørsmål} />
    </VStack>
  );
};
