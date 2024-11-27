import './utils/polyfills';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '@navikt/ds-css';
import './App.css';
import './overgangsstønad/Forside.css';
import './overgangsstønad/Søknadsdialog.css';
import './components/feil/Feilside.css';
import './components/spørsmål/Spørsmål.css';
import './components/side/Side.css';
import './overgangsstønad/steg/4-barnasbosted/BarnasBosted.css';
import './søknad/steg/7-oppsummering/Oppsummering.css';
import './arbeidssøkerskjema/side/Side.css';
import './arbeidssøkerskjema/Oppsummering.css';
import './arbeidssøkerskjema/Forside.css';
import * as serviceWorker from './serviceWorker';
import App from './App';
import ArbeidssøkerApp from './arbeidssøkerskjema/SkjemaApp';
import BarnetilsynApp from './barnetilsyn/BarnetilsynApp';
import React from 'react';
import { SpråkProvider } from './context/SpråkContext';
import ContextProviders from './context/ContextProviders';
import { ScrollToTop } from './utils/visning';
import * as Sentry from '@sentry/browser';
import Environment from './Environment';
import SkolepengerApp from './skolepenger/SkolepengerApp';
import { createRoot } from 'react-dom/client';
import { PdfKvittering } from './overgangsstønad/Pdfkvittering';
import { QueryClient, QueryClientProvider } from 'react-query';

if (Environment().sentryUrl) {
  Sentry.init({
    dsn: Environment().sentryUrl,
    environment: Environment().miljø,
  });
}
const container = document.getElementById('root');
if (container == null) {
  throw new Error('Mangler container for appen');
} else {
  const root = createRoot(container);
  const queryClient = new QueryClient();
  root.render(
    <QueryClientProvider client={queryClient}>
      <SpråkProvider>
        <ContextProviders>
          <Router basename={process.env.PUBLIC_URL}>
            <ScrollToTop />
            <Routes>
              <Route path={'/arbeidssoker/*'} element={<ArbeidssøkerApp />} />
              <Route path={'/barnetilsyn/*'} element={<BarnetilsynApp />} />
              <Route path={'/skolepenger/*'} element={<SkolepengerApp />} />
              <Route path={'/pdf-kvittering/*'} element={<PdfKvittering />} />
              <Route path={'*'} element={<App />} />
            </Routes>
          </Router>
        </ContextProviders>
      </SpråkProvider>
    </QueryClientProvider>
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
