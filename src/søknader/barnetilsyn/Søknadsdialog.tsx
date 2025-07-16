import React, { FC } from 'react';
import { Route, Routes } from 'react-router';
import Forside from './Forside';
import BarnaDine from './steg/3-barnadine/BarnaDine';
import BarnasBosted from './steg/4-barnasbosted/BarnasBosted';
import Aktivitet from './steg/5-aktivitet/Aktivitet';
import Oppsummering from './steg/7-oppsummering/Oppsummering';
import Dokumentasjon from './steg/8-dokumentasjon/Dokumentasjon';
import Kvittering from './steg/9-kvittering/Kvittering';
import Barnepass from './steg/6-barnepass/Barnepass';
import RedirectTilStart from './RedirectTilStart';
import Gjenbruk from './steg/0.5-gjenbruk/Gjenbruk';
import { Stønadstype } from '../../models/søknad/stønadstyper';
import { useBarnetilsynSøknad } from './BarnetilsynContext';
import { RoutesBarnetilsyn } from './routing/routesBarnetilsyn';
import { pathOppsummeringBarnetilsyn } from './utils';
import { OmDegProvider } from '../felles/steg/1-omdeg/OmDegContext';
import { erBarnetilsynSøknad, Søknad } from '../../models/søknad/søknad';
import { BosituasjonProvider } from '../felles/steg/2-bosituasjon/BosituasjonContext';
import { Bosituasjon } from '../felles/steg/2-bosituasjon/Bosituasjon';
import { OmDegV2 } from '../felles/steg/1-omdeg/v2/OmDegV2';

const SøknadsdialogBarnetilsyn: FC = () => {
  const {
    søknad,
    settSøknad,
    mellomlagretBarnetilsyn,
    mellomlagreBarnetilsyn2,
    settDokumentasjonsbehov,
  } = useBarnetilsynSøknad();

  const oppdaterBarnetilsynSøknad = (søknad: Søknad) => {
    if (erBarnetilsynSøknad(søknad)) {
      settSøknad(søknad);
    }
  };

  const mellomlagreBarnetilsynSøknad = (steg: string, søknad: Søknad) => {
    if (erBarnetilsynSøknad(søknad)) {
      mellomlagreBarnetilsyn2(steg, søknad);
    }
  };

  return (
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
        path={'/barnepass'}
        element={
          <RedirectTilStart>
            <Barnepass />
          </RedirectTilStart>
        }
      />
      <Route
        path={'/aktivitet'}
        element={
          <RedirectTilStart>
            <Aktivitet />
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
            <BarnaDine />
          </RedirectTilStart>
        }
      />
      <Route
        path={'/bosituasjon'}
        element={
          <RedirectTilStart>
            <BosituasjonProvider
              stønadstype={Stønadstype.barnetilsyn}
              søknad={søknad}
              oppdaterSøknad={oppdaterBarnetilsynSøknad}
              mellomlagretSøknad={mellomlagretBarnetilsyn}
              mellomlagreSøknad={mellomlagreBarnetilsynSøknad}
              routes={RoutesBarnetilsyn}
              pathOppsummering={pathOppsummeringBarnetilsyn}
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
              stønadstype={Stønadstype.barnetilsyn}
              søknad={søknad}
              oppdaterSøknad={oppdaterBarnetilsynSøknad}
              mellomlagretSøknad={mellomlagretBarnetilsyn}
              mellomlagreSøknad={mellomlagreBarnetilsynSøknad}
              routes={RoutesBarnetilsyn}
              pathOppsummering={pathOppsummeringBarnetilsyn}
              settDokumentasjonsbehov={settDokumentasjonsbehov}
            >
              <OmDegV2 />
            </OmDegProvider>
          </RedirectTilStart>
        }
      />
      <Route
        path={'/gjenbruk'}
        element={
          <RedirectTilStart>
            <Gjenbruk />
          </RedirectTilStart>
        }
      />
      <Route path={'*'} element={<Forside />} />
    </Routes>
  );
};

export default SøknadsdialogBarnetilsyn;
