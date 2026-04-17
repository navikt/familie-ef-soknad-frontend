import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import Forside from './Forside';
import MerOmDinSituasjon from './steg/6-meromsituasjon/MerOmDinSituasjon';
import Oppsummering from './steg/7-oppsummering/Oppsummering';
import Kvittering from './steg/9-kvittering/Kvittering';
import RedirectTilStart from './RedirectTilStart';
import { OmDegProvider } from '../felles/steg/1-omdeg/OmDegContext';
import { Stønadstype } from '../../models/søknad/stønadstyper';
import OmDeg from '../felles/steg/1-omdeg/OmDeg';
import { useOvergangsstønadSøknad } from './OvergangsstønadContext';
import { hentRoutesOvergangsstonad } from './routing/routesOvergangsstonad';
import { pathOppsummeringOvergangsstønad } from './utils';
import { erOvergangsstønadSøknad, Søknad } from '../../models/søknad/søknad';
import { BosituasjonProvider } from '../felles/steg/2-bosituasjon/BosituasjonContext';
import { Bosituasjon } from '../felles/steg/2-bosituasjon/Bosituasjon';
import { BarnaDineProvider } from '../felles/steg/3-barnadine/BarnaDineContext';
import { BarnaDine } from '../felles/steg/3-barnadine/BarnaDine';
import { BarnasBosted } from '../felles/steg/4-barnasbosted/BarnasBosted';
import { BarnasBostedProvider } from '../felles/steg/4-barnasbosted/BarnasBostedContext';
import { Aktivitet } from './steg/5-aktivitet/Aktivitet';
import { AktivitetProvider } from './steg/5-aktivitet/AktivitetContext';

import Dokumentasjon from '../felles/steg/8-dokumentasjon/Dokumentasjon';
import { DokumentasjonsProvider } from '../felles/steg/8-dokumentasjon/DokumentasjonsContext';
import { useToggles } from '../../context/TogglesContext';
import { ToggleName } from '../../models/søknad/toggles';
import { Situasjon } from './steg/5-regelendring-2026/Situasjon';

const Søknadsdialog: FC = () => {
  const {
    søknad,
    settSøknad,
    mellomlagretOvergangsstønad,
    mellomlagreOvergangsstønad2,
    oppdaterBarnISøknaden,
    oppdaterFlereBarnISøknaden,
    settDokumentasjonsbehov,
    settDokumentasjonsbehovForBarn,
  } = useOvergangsstønadSøknad();

  const { toggles } = useToggles();

  const toggleBrukRegelendringer2026 = toggles[ToggleName.overgangsstønadRegelendringer2026];

  const overgangsstønadRoutes = hentRoutesOvergangsstonad(toggleBrukRegelendringer2026);

  const oppdaterOvergangsstønadSøknad = (søknad: Søknad) => {
    if (erOvergangsstønadSøknad(søknad)) {
      settSøknad(søknad);
    }
  };

  const mellomlagreOverganggstønadSøknad = (steg: string, søknad: Søknad) => {
    if (erOvergangsstønadSøknad(søknad)) {
      mellomlagreOvergangsstønad2(steg, søknad);
    }
  };

  return (
    <>
      <Routes>
        <Route
          path={'/kvittering'}
          element={
            <RedirectTilStart>
              <Kvittering />
            </RedirectTilStart>
          }
        />
        <Route
          path={'/dokumentasjon'}
          element={
            <RedirectTilStart>
              <DokumentasjonsProvider
                stønadstype={Stønadstype.overgangsstønad}
                søknad={søknad}
                oppdaterSøknad={oppdaterOvergangsstønadSøknad}
                mellomlagreSøknad={mellomlagreOverganggstønadSøknad}
                routes={overgangsstønadRoutes}
              >
                <Dokumentasjon />
              </DokumentasjonsProvider>
            </RedirectTilStart>
          }
        />
        <Route
          path={'/oppsummering'}
          element={
            <RedirectTilStart>
              <Oppsummering />
            </RedirectTilStart>
          }
        />
        <Route
          path={'/din-situasjon'}
          element={
            <RedirectTilStart>
              <MerOmDinSituasjon />
            </RedirectTilStart>
          }
        />
        <Route
          path={'/aktivitet'}
          element={
            <RedirectTilStart>
              <AktivitetProvider
                søknad={søknad}
                oppdaterSøknad={oppdaterOvergangsstønadSøknad}
                mellomlagreSøknad={mellomlagreOverganggstønadSøknad}
                settDokumentasjonsbehov={settDokumentasjonsbehov}
              >
                <Aktivitet />
              </AktivitetProvider>
            </RedirectTilStart>
          }
        />
        <Route
          path={'/aktivitet-og-situasjon'}
          element={
            <RedirectTilStart>
              <AktivitetProvider
                søknad={søknad}
                oppdaterSøknad={oppdaterOvergangsstønadSøknad}
                mellomlagreSøknad={mellomlagreOverganggstønadSøknad}
                settDokumentasjonsbehov={settDokumentasjonsbehov}
              >
                <Situasjon />
              </AktivitetProvider>
            </RedirectTilStart>
          }
        />
        <Route
          path={'/barnas-bosted'}
          element={
            <RedirectTilStart>
              <BarnasBostedProvider
                stønadstype={Stønadstype.overgangsstønad}
                søknad={søknad}
                oppdaterSøknad={oppdaterOvergangsstønadSøknad}
                oppdaterBarnISøknaden={oppdaterBarnISøknaden}
                oppdaterFlereBarnISøknaden={oppdaterFlereBarnISøknaden}
                mellomlagreSøknad={mellomlagreOverganggstønadSøknad}
                routes={overgangsstønadRoutes}
                pathOppsummering={pathOppsummeringOvergangsstønad}
                settDokumentasjonsbehovForBarn={settDokumentasjonsbehovForBarn}
              >
                <BarnasBosted />
              </BarnasBostedProvider>
            </RedirectTilStart>
          }
        />
        <Route
          path={'/barn'}
          element={
            <RedirectTilStart>
              <BarnaDineProvider
                stønadstype={Stønadstype.overgangsstønad}
                søknad={søknad}
                oppdaterSøknad={oppdaterOvergangsstønadSøknad}
                mellomlagretSøknad={mellomlagretOvergangsstønad}
                mellomlagreSøknad={mellomlagreOverganggstønadSøknad}
                routes={overgangsstønadRoutes}
                pathOppsummering={pathOppsummeringOvergangsstønad}
                settDokumentasjonsbehovForBarn={settDokumentasjonsbehovForBarn}
              >
                <BarnaDine />
              </BarnaDineProvider>
            </RedirectTilStart>
          }
        />
        <Route
          path={'/bosituasjon'}
          element={
            <RedirectTilStart>
              <BosituasjonProvider
                stønadstype={Stønadstype.overgangsstønad}
                søknad={søknad}
                oppdaterSøknad={oppdaterOvergangsstønadSøknad}
                mellomlagretSøknad={mellomlagretOvergangsstønad}
                mellomlagreSøknad={mellomlagreOverganggstønadSøknad}
                routes={overgangsstønadRoutes}
                pathOppsummering={pathOppsummeringOvergangsstønad}
                settDokumentasjonsbehov={settDokumentasjonsbehov}
              >
                <Bosituasjon />
              </BosituasjonProvider>
            </RedirectTilStart>
          }
        />
        <Route
          path={'/om-deg'}
          element={
            <RedirectTilStart>
              <OmDegProvider
                stønadstype={Stønadstype.overgangsstønad}
                søknad={søknad}
                oppdaterSøknad={oppdaterOvergangsstønadSøknad}
                mellomlagretSøknad={mellomlagretOvergangsstønad}
                mellomlagreSøknad={mellomlagreOverganggstønadSøknad}
                routes={overgangsstønadRoutes}
                pathOppsummering={pathOppsummeringOvergangsstønad}
                settDokumentasjonsbehov={settDokumentasjonsbehov}
              >
                <OmDeg />
              </OmDegProvider>
            </RedirectTilStart>
          }
        />
        <Route path={'*'} element={<Forside />} />
      </Routes>
    </>
  );
};

export default Søknadsdialog;
