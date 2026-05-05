import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '@navikt/ds-css';
import './index.css';
import './søknader/overgangsstønad/Forside.css';
import './søknader/overgangsstønad/Søknadsdialog.css';
import './components/feil/Feilside.css';
import './components/spørsmål/Spørsmål.css';
import './components/side/Side.module.css';
import './søknader/felles/steg/4-barnasbosted/BarnasBosted.css';
import './søknader/felles/steg/7-oppsummering/Oppsummering.css';
import './søknader/arbeidssøkerskjema/side/Side.css';
import './søknader/arbeidssøkerskjema/Oppsummering.css';
import './søknader/arbeidssøkerskjema/Forside.css';
import { OvergangsstønadApp } from './søknader/overgangsstønad/OvergangsstønadApp';
import ArbeidssøkerApp from './søknader/arbeidssøkerskjema/SkjemaApp';
import BarnetilsynApp from './søknader/barnetilsyn/BarnetilsynApp';
import React from 'react';
import { SpråkProvider } from './context/SpråkContext';
import ContextProviders from './context/ContextProviders';
import { ScrollToTop } from './utils/visning';
import * as Sentry from '@sentry/browser';
import { isAxiosError } from 'axios';
import Environment from './Environment';
import SkolepengerApp from './søknader/skolepenger/SkolepengerApp';
import { createRoot } from 'react-dom/client';

if (Environment().sentryUrl) {
  Sentry.init({
    dsn: Environment().sentryUrl,
    environment: Environment().miljø,

    beforeSend(event, hint) {
      const error = hint?.originalException;

      if (isAxiosError(error) && error.code === 'ERR_NETWORK') {
        if (Environment().miljø !== 'production') {
          console.warn(
            'AxiosError ERR_NETWORK filtrert fra Sentry:',
            error.message,
            error.config?.url
          );
        }
        return null;
      }
      return event;
    },
  });
}

const container = document.getElementById('root');

if (container == null) {
  throw new Error('Mangler container for appen');
} else {
  const root = createRoot(container);

  //TODO: Prefix med /overganggstonad
  root.render(
    <SpråkProvider>
      <ContextProviders>
        <Router basename={process.env.PUBLIC_URL}>
          <ScrollToTop />
          <Routes>
            <Route path={'/arbeidssoker/*'} element={<ArbeidssøkerApp />} />
            <Route path={'/barnetilsyn/*'} element={<BarnetilsynApp />} />
            <Route path={'/skolepenger/*'} element={<SkolepengerApp />} />
            <Route path={'*'} element={<OvergangsstønadApp />} />
          </Routes>
        </Router>
      </ContextProviders>
    </SpråkProvider>
  );
}
