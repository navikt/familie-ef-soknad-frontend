import React, { FC } from 'react';
import { Route, Routes } from 'react-router';
import Forside from './Forside';
import OmDeg from './steg/1-omdeg/OmDeg';
import Bosituasjon from './steg/2-bosituasjon/Bosituasjon';
import BarnaDine from './steg/3-barnadine/BarnaDine';
import BarnasBosted from './steg/4-barnasbosted/BarnasBosted';
import Aktivitet from './steg/5-aktivitet/Aktivitet';
import Oppsummering from './steg/7-oppsummering/Oppsummering';
import Dokumentasjon from './steg/8-dokumentasjon/Dokumentasjon';
import Kvittering from './steg/9-kvittering/Kvittering';
import Barnepass from './steg/6-barnepass/Barnepass';
import RedirectTilStart from './RedirectTilStart';
import Gjenbruk from './steg/0.5-gjenbruk/Gjenbruk';

const SøknadsdialogBarnetilsyn: FC = () => {
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
            <Bosituasjon />
          </RedirectTilStart>
        }
      />
      <Route
        path={'/om-deg'}
        element={
          <RedirectTilStart>
            <OmDeg />
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
