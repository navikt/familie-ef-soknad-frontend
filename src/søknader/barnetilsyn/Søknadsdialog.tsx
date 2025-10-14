import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import Forside from './Forside';
import { BarnaDine } from './steg/3-barnadine/BarnaDine';
import Oppsummering from './steg/7-oppsummering/Oppsummering';
import Kvittering from './steg/9-kvittering/Kvittering';
import Barnepass from './steg/6-barnepass/Barnepass';
import RedirectTilStart from './RedirectTilStart';
import Gjenbruk from './steg/0.5-gjenbruk/Gjenbruk';
import { Stønadstype } from '../../models/søknad/stønadstyper';
import OmDeg from '../felles/steg/1-omdeg/OmDeg';
import { useBarnetilsynSøknad } from './BarnetilsynContext';
import { RoutesBarnetilsyn } from './routing/routesBarnetilsyn';
import { pathOppsummeringBarnetilsyn } from './utils';
import { OmDegProvider } from '../felles/steg/1-omdeg/OmDegContext';
import { erBarnetilsynSøknad, Søknad } from '../../models/søknad/søknad';
import { BosituasjonProvider } from '../felles/steg/2-bosituasjon/BosituasjonContext';
import { Bosituasjon } from '../felles/steg/2-bosituasjon/Bosituasjon';
import { BarnepassProvider } from './steg/6-barnepass/BarnepassContext';
import { BarnasBosted } from '../felles/steg/4-barnasbosted/BarnasBosted';
import { BarnasBostedProvider } from '../felles/steg/4-barnasbosted/BarnasBostedContext';
import { AktivitetProvider } from './steg/5-aktivitet/AktivitetContext';
import Dokumentasjon from '../felles/steg/8-dokumentasjon/Dokumentasjon';
import { DokumentasjonsProvider } from '../felles/steg/8-dokumentasjon/DokumentasjonsContext';
import { Aktivitet } from './steg/5-aktivitet/Aktivitet';
import { BarnetilsynBarnaDineProvider } from './steg/3-barnadine/BarnetilsynBarnaDineContext';

const SøknadsdialogBarnetilsyn: FC = () => {
  const {
    søknad,
    settSøknad,
    mellomlagretBarnetilsyn,
    mellomlagreBarnetilsyn2,
    oppdaterBarnISøknaden,
    oppdaterFlereBarnISøknaden,
    settDokumentasjonsbehov,
    settDokumentasjonsbehovForBarn,
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
            <DokumentasjonsProvider
              stønadstype={Stønadstype.barnetilsyn}
              søknad={søknad}
              oppdaterSøknad={oppdaterBarnetilsynSøknad}
              mellomlagreSøknad={mellomlagreBarnetilsynSøknad}
              routes={RoutesBarnetilsyn}
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
        path={'/barnepass'}
        element={
          <RedirectTilStart>
            <BarnepassProvider
              søknad={søknad}
              oppdaterSøknad={oppdaterBarnetilsynSøknad}
              mellomlagretSøknad={mellomlagretBarnetilsyn}
              mellomlagreSøknad={mellomlagreBarnetilsynSøknad}
              routes={RoutesBarnetilsyn}
              pathOppsummering={pathOppsummeringBarnetilsyn}
              settDokumentasjonsbehovForBarn={settDokumentasjonsbehovForBarn}
            >
              <Barnepass />
            </BarnepassProvider>
          </RedirectTilStart>
        }
      />
      <Route
        path={'/aktivitet'}
        element={
          <RedirectTilStart>
            <AktivitetProvider
              søknad={søknad}
              oppdaterSøknad={oppdaterBarnetilsynSøknad}
              mellomlagreSøknad={mellomlagreBarnetilsynSøknad}
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
            <BarnasBostedProvider
              stønadstype={Stønadstype.barnetilsyn}
              søknad={søknad}
              oppdaterSøknad={oppdaterBarnetilsynSøknad}
              oppdaterBarnISøknaden={oppdaterBarnISøknaden}
              oppdaterFlereBarnISøknaden={oppdaterFlereBarnISøknaden}
              mellomlagreSøknad={mellomlagreBarnetilsynSøknad}
              routes={RoutesBarnetilsyn}
              pathOppsummering={pathOppsummeringBarnetilsyn}
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
            <BarnetilsynBarnaDineProvider
              søknad={søknad}
              oppdaterBarnISøknaden={oppdaterBarnISøknaden}
              mellomlagreSøknad={mellomlagreBarnetilsynSøknad}
              routes={RoutesBarnetilsyn}
              pathOppsummering={pathOppsummeringBarnetilsyn}
            >
              <BarnaDine />
            </BarnetilsynBarnaDineProvider>
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
              <OmDeg />
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
