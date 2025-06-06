import React from 'react';
import { SpørsmålRenderer } from './SpørsmålRenderer';
import { borDuPåDenneAdressenSpørsmål } from '../../../../søknad/steg/1-omdeg/spørsmål/borDuPåDenneAdressenSpørsmål';

export const OmDegSpørsmålSeksjon: React.FC = () => {
  return <SpørsmålRenderer spørsmål={borDuPåDenneAdressenSpørsmål} />;
};
