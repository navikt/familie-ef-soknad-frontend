import React from 'react';
import { SingleSelectSpørsmål } from './Spørsmål';
import { SpørsmålRenderer } from './SpørsmålRenderer';

export const likerDuAlertsSpørsmål: SingleSelectSpørsmål = {
  id: 'likerDuAlerts',

  type: 'single-select',

  spørsmålTekstKey: 'Liker du alerts?',

  svarAlternativLayout: 'horizontal',
  svarAlternativ: [
    { svarVerdi: 'ja', label: 'svar.ja' },
    { svarVerdi: 'nei', label: 'svar.nei' },
  ],

  alerts: [
    {
      id: 'always',
      alertTekstKey: 'Dette er alltid synlig',
      alertVariant: 'info',
      skalAlltidVises: true,
    },
  ],

  oppfølgningsSpørsmål: [
    {
      visNår: (svar) => svar === 'ja',
      spørsmål: {
        id: 'hvorforJa',
        type: 'single-select',
        spørsmålTekstKey: 'Hva liker du med alerts?',
        svarAlternativLayout: 'vertical',
        svarAlternativ: [
          { svarVerdi: 'utseende', label: 'Utseendet' },
          { svarVerdi: 'funksjon', label: 'Funksjonaliteten' },
        ],
      },
    },
    {
      visNår: (svar) => svar === 'nei',
      spørsmål: {
        id: 'hvorforNei',
        type: 'single-select',
        spørsmålTekstKey: 'Hvorfor ikke?',
        svarAlternativLayout: 'vertical',
        svarAlternativ: [
          { svarVerdi: 'irriterende', label: 'De er irriterende' },
          { svarVerdi: 'unødvendig', label: 'Unødvendige' },
        ],
      },
    },
  ],
};

export const OmDegSpørsmålSeksjon: React.FC = () => {
  return <SpørsmålRenderer spørsmål={likerDuAlertsSpørsmål} />;
};
