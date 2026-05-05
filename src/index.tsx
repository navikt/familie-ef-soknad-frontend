import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
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
import React, { useEffect } from 'react';
import { SpråkProvider } from './context/SpråkContext';
import ContextProviders from './context/ContextProviders';
import { ScrollToTop } from './utils/visning';
import * as Sentry from '@sentry/react';
import { isAxiosError } from 'axios';
import Environment from './Environment';
import SkolepengerApp from './søknader/skolepenger/SkolepengerApp';
import { createRoot } from 'react-dom/client';
import Feilside from './components/feil/Feilside';

if (Environment().sentryUrl) {
  Sentry.init({
    dsn: Environment().sentryUrl,
    environment: Environment().miljø,
    release: process.env.SENTRY_RELEASE || undefined,

    denyUrls: [
      /^chrome-extension:\/\//,
      /^moz-extension:\/\//,
      /^safari-extension:\/\//,
      /^safari-web-extension:\/\//,
      /^webkit-masked-url:\/\//,
    ],

    ignoreErrors: [
      'OpsMessages.connectedCallback',
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      "evaluating 'response.showSearchResults'",
    ],

    beforeSend(event, hint) {
      const error = hint?.originalException;

      if (isAxiosError(error) && (error.code === 'ERR_NETWORK' || error.code === 'ERR_CANCELED')) {
        if (Environment().miljø !== 'production') {
          console.warn(
            `AxiosError ${error.code} filtrert fra Sentry:`,
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

const SentryRouteTagger: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const stønadstype = location.pathname.split('/').filter(Boolean)[0] ?? 'ukjent';
    Sentry.setTag('stønadstype', stønadstype);
  }, [location.pathname]);

  return null;
};

const container = document.getElementById('root');

if (container == null) {
  throw new Error('Mangler container for appen');
} else {
  const root = createRoot(container);

  //TODO: Prefix med /overganggstonad
  root.render(
    <SpråkProvider>
      <ContextProviders>
        <Sentry.ErrorBoundary fallback={<Feilside />}>
          <Router basename={process.env.PUBLIC_URL}>
            <ScrollToTop />
            <SentryRouteTagger />
            <Routes>
              <Route path={'/arbeidssoker/*'} element={<ArbeidssøkerApp />} />
              <Route path={'/barnetilsyn/*'} element={<BarnetilsynApp />} />
              <Route path={'/skolepenger/*'} element={<SkolepengerApp />} />
              <Route path={'*'} element={<OvergangsstønadApp />} />
            </Routes>
          </Router>
        </Sentry.ErrorBoundary>
      </ContextProviders>
    </SpråkProvider>
  );
}
