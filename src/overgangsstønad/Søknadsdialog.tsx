import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import Aktivitet from './steg/5-aktivitet/Aktivitet';
import BarnaDine from './steg/3-barnadine/BarnaDine';
import BarnasBosted from './steg/4-barnasbosted/BarnasBosted';
import Bosituasjon from './steg/2-bosituasjon/Bosituasjon';
import Forside from './Forside';
import OmDeg from './steg/1-omdeg/OmDeg';
import MerOmDinSituasjon from './steg/6-meromsituasjon/MerOmDinSituasjon';
import Dokumentasjon from './steg/8-dokumentasjon/Dokumentasjon';
import Oppsummering from './steg/7-oppsummering/Oppsummering';
import Kvittering from './steg/9-kvittering/Kvittering';
import RedirectTilStart from './RedirectTilStart';
import { OmDegProvider } from '../barnetilsyn/steg/1-omdeg/OmDegContext';

const Søknadsdialog: FC = () => {
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
              <MerOmDinSituasjon />
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
              <OmDegProvider>
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
