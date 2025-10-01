import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import Forside from './Forside';
import RedirectTilStart from './RedirectTilStart';
import UtdanningSituasjon from './steg/5-aktivitet/UtdanningSituasjon';
import Oppsummering from './steg/6-oppsummering/Oppsummering';
import Kvittering from './steg/8-kvittering/Kvittering';
import Dokumentasjon from './steg/7-dokumentasjon/Dokumentasjon';
import { OmDegProvider } from '../felles/steg/1-omdeg/OmDegContext';
import { Stønadstype } from '../../models/søknad/stønadstyper';
import OmDeg from '../felles/steg/1-omdeg/OmDeg';
import { useSkolepengerSøknad } from './SkolepengerContext';
import { RoutesSkolepenger } from './routing/routes';
import { pathOppsummeringSkolepenger } from './utils';
import { erSkolepengerSøknad, Søknad } from '../../models/søknad/søknad';
import { BosituasjonProvider } from '../felles/steg/2-bosituasjon/BosituasjonContext';
import { Bosituasjon } from '../felles/steg/2-bosituasjon/Bosituasjon';
import { BarnaDineProvider } from '../felles/steg/3-barnadine/BarnaDineContext';
import { BarnaDine } from '../felles/steg/3-barnadine/BarnaDine';
import { BarnasBosted } from '../felles/steg/4-barnasbosted/BarnasBosted';
import { BarnasBostedProvider } from '../felles/steg/4-barnasbosted/BarnasBostedContext';
import { UtdanningSituasjonProvider } from './steg/5-aktivitet/UtdanningSituasjonContext';

const SøknadsdialogSkolepenger: FC = () => {
  const {
    søknad,
    settSøknad,
    mellomlagretSkolepenger,
    mellomlagreSkolepenger2,
    oppdaterBarnISøknaden,
    oppdaterFlereBarnISøknaden,
    settDokumentasjonsbehov,
    settDokumentasjonsbehovForBarn,
  } = useSkolepengerSøknad();

  const oppdaterSkolepengerSøknad = (søknad: Søknad) => {
    if (erSkolepengerSøknad(søknad)) {
      settSøknad(søknad);
    }
  };

  const mellomlagreSkolepengerSøknad = (steg: string, søknad: Søknad) => {
    if (erSkolepengerSøknad(søknad)) {
      mellomlagreSkolepenger2(steg, søknad);
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
        path={'/utdanning'}
        element={
          <RedirectTilStart>
            <UtdanningSituasjonProvider
              søknad={søknad}
              oppdaterSøknad={oppdaterSkolepengerSøknad}
              mellomlagreSøknad={mellomlagreSkolepengerSøknad}
              settDokumentasjonsbehov={settDokumentasjonsbehov}
            >
              <UtdanningSituasjon />
            </UtdanningSituasjonProvider>
          </RedirectTilStart>
        }
      />
      <Route
        path={'/barnas-bosted'}
        element={
          <RedirectTilStart>
            <BarnasBostedProvider
              stønadstype={Stønadstype.skolepenger}
              søknad={søknad}
              oppdaterSøknad={oppdaterSkolepengerSøknad}
              oppdaterBarnISøknaden={oppdaterBarnISøknaden}
              oppdaterFlereBarnISøknaden={oppdaterFlereBarnISøknaden}
              mellomlagreSøknad={mellomlagreSkolepengerSøknad}
              routes={RoutesSkolepenger}
              pathOppsummering={pathOppsummeringSkolepenger}
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
              stønadstype={Stønadstype.skolepenger}
              søknad={søknad}
              oppdaterSøknad={oppdaterSkolepengerSøknad}
              mellomlagretSøknad={mellomlagretSkolepenger}
              mellomlagreSøknad={mellomlagreSkolepengerSøknad}
              routes={RoutesSkolepenger}
              pathOppsummering={pathOppsummeringSkolepenger}
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
              stønadstype={Stønadstype.skolepenger}
              søknad={søknad}
              oppdaterSøknad={oppdaterSkolepengerSøknad}
              mellomlagretSøknad={mellomlagretSkolepenger}
              mellomlagreSøknad={mellomlagreSkolepengerSøknad}
              routes={RoutesSkolepenger}
              pathOppsummering={pathOppsummeringSkolepenger}
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
              stønadstype={Stønadstype.skolepenger}
              søknad={søknad}
              oppdaterSøknad={oppdaterSkolepengerSøknad}
              mellomlagretSøknad={mellomlagretSkolepenger}
              mellomlagreSøknad={mellomlagreSkolepengerSøknad}
              routes={RoutesSkolepenger}
              pathOppsummering={pathOppsummeringSkolepenger}
              settDokumentasjonsbehov={settDokumentasjonsbehov}
            >
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
