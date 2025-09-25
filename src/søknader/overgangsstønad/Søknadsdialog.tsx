import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import Aktivitet from './steg/5-aktivitet/Aktivitet';
import BarnasBosted from './steg/4-barnasbosted/BarnasBosted';
import Forside from './Forside';
import MerOmDinSituasjon from './steg/6-meromsituasjon/MerOmDinSituasjon';
import Dokumentasjon from './steg/8-dokumentasjon/Dokumentasjon';
import Oppsummering from './steg/7-oppsummering/Oppsummering';
import Kvittering from './steg/9-kvittering/Kvittering';
import RedirectTilStart from './RedirectTilStart';
import { OmDegProvider } from '../felles/steg/1-omdeg/OmDegContext';
import { Stønadstype } from '../../models/søknad/stønadstyper';
import OmDeg from '../felles/steg/1-omdeg/OmDeg';
import { useOvergangsstønadSøknad } from './OvergangsstønadContext';
import { RoutesOvergangsstonad } from './routing/routesOvergangsstonad';
import { pathOppsummeringOvergangsstønad } from './utils';
import { erOvergangsstønadSøknad, Søknad } from '../../models/søknad/søknad';
import { BosituasjonProvider } from '../felles/steg/2-bosituasjon/BosituasjonContext';
import { Bosituasjon } from '../felles/steg/2-bosituasjon/Bosituasjon';
import { BarnaDineProvider } from '../felles/steg/3-barnadine/BarnaDineContext';
import { BarnaDine } from '../felles/steg/3-barnadine/BarnaDine';
import { AktivitetProvider } from './steg/5-aktivitet/AktivitetContext';
import { MerOmDinSituasjonProvider } from './steg/6-meromsituasjon/MerOmDinSituasjonContext';

const Søknadsdialog: FC = () => {
  const {
    søknad,
    settSøknad,
    mellomlagretOvergangsstønad,
    mellomlagreOvergangsstønad2,
    settDokumentasjonsbehov,
    settDokumentasjonsbehovForBarn,
    oppdaterBarnISøknaden,
  } = useOvergangsstønadSøknad();

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
              <Dokumentasjon />
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
              <MerOmDinSituasjonProvider
                søknad={søknad}
                oppdaterSøknad={oppdaterOvergangsstønadSøknad}
                mellomlagreSøknad={mellomlagreOverganggstønadSøknad}
                settDokumentasjonsbehov={settDokumentasjonsbehov}
                oppdaterBarnISøknaden={oppdaterBarnISøknaden}
              >
                <MerOmDinSituasjon />
              </MerOmDinSituasjonProvider>
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
          path={'/barnas-bosted'}
          element={
            <RedirectTilStart>
              <BarnasBosted />
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
                routes={RoutesOvergangsstonad}
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
                routes={RoutesOvergangsstonad}
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
                routes={RoutesOvergangsstonad}
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
