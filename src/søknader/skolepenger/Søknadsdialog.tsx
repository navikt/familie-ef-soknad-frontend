import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import Forside from './Forside';
import RedirectTilStart from './RedirectTilStart';
import OmDeg from './steg/1-omdeg/OmDeg';
import Bosituasjon from './steg/2-bosituasjon/Bosituasjon';
import BarnaDine from './steg/3-barnadine/BarnaDine';
import BarnasBosted from './steg/4-barnasbosted/BarnasBosted';
import UtdanningSituasjon from './steg/5-aktivitet/UtdanningSituasjon';
import Oppsummering from './steg/6-oppsummering/Oppsummering';
import Kvittering from './steg/8-kvittering/Kvittering';
import Dokumentasjon from './steg/7-dokumentasjon/Dokumentasjon';
import { OmDegProvider } from '../barnetilsyn/steg/1-omdeg/OmDegContext';

const SøknadsdialogSkolepenger: FC = () => {
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
        path={'/utdanning'}
        element={
          <RedirectTilStart>
            <UtdanningSituasjon />
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
            <OmDegProvider>
              <OmDeg />
            </OmDegProvider>
          </RedirectTilStart>
        }
      />
      <Route path={'*'} element={<Forside />} />
    </Routes>
  );
};

export default SøknadsdialogSkolepenger;
