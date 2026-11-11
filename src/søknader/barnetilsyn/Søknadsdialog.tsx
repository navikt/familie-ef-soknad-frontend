import React, { type FC } from 'react';
import { Route, Routes } from 'react-router';
import { Stønadstype } from '../../models/søknad/stønadstyper';
import { erBarnetilsynSøknad, type Søknad } from '../../models/søknad/søknad';
import OmDeg from '../felles/steg/1-omdeg/OmDeg';
import { OmDegProvider } from '../felles/steg/1-omdeg/OmDegContext';
import { Bosituasjon } from '../felles/steg/2-bosituasjon/Bosituasjon';
import { BosituasjonProvider } from '../felles/steg/2-bosituasjon/BosituasjonContext';
import { BarnasBosted } from '../felles/steg/4-barnasbosted/BarnasBosted';
import { BarnasBostedProvider } from '../felles/steg/4-barnasbosted/BarnasBostedContext';
import Dokumentasjon from '../felles/steg/8-dokumentasjon/Dokumentasjon';
import { DokumentasjonsProvider } from '../felles/steg/8-dokumentasjon/DokumentasjonsContext';
import { useBarnetilsynSøknad } from './BarnetilsynContext';
import Forside from './Forside';
import RedirectTilStart from './RedirectTilStart';
import { useBarnetilsynRoutes } from './routing/useBarnetilsynRoutes';
import Gjenbruk from './steg/0.5-gjenbruk/Gjenbruk';
import { BarnaDine } from './steg/3-barnadine/BarnaDine';
import { Aktivitet } from './steg/5-aktivitet/Aktivitet';
import { AktivitetProvider } from './steg/5-aktivitet/AktivitetContext';
import { Barnepass } from './steg/6-barnepass/Barnepass';
import { BarnepassProvider } from './steg/6-barnepass/BarnepassContext';
import Oppsummering from './steg/7-oppsummering/Oppsummering';
import Kvittering from './steg/9-kvittering/Kvittering';
import { pathOppsummeringBarnetilsyn } from './utils';

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

    const { routes } = useBarnetilsynRoutes();

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
                            routes={routes}
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
                            routes={routes}
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
                            routes={routes}
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
                            routes={routes}
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
                            routes={routes}
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
