import { IRoute } from '../../../models/routes';

export enum ERouteOvergangsstønad {
  Forside = 'Forside',
  OmDeg = 'OmDeg',
  BosituasjonenDin = 'BosituasjonenDin',
  Barn = 'Barn',
  BarnasBosted = 'BarnasBosted',
  Aktivitet = 'Aktivitet',
  DinSituasjon = 'DinSituasjon',
  AktivitetOgSituasjon = 'AktivitetOgSituasjon',
  Oppsummering = 'Oppsummering',
  Dokumentasjon = 'Dokumentasjon',
  Kvittering = 'Kvittering',
}

const FELLESSTEG_FØR: IRoute[] = [
  { path: '/', label: 'Forside', route: ERouteOvergangsstønad.Forside },
  {
    path: '/om-deg',
    label: 'Om deg',
    route: ERouteOvergangsstønad.OmDeg,
    localeTekst: 'stegtittel.omDeg',
  },
  {
    path: '/bosituasjon',
    label: 'Bosituasjonen din',
    route: ERouteOvergangsstønad.BosituasjonenDin,
    localeTekst: 'stegtittel.bosituasjon',
  },
  {
    path: '/barn',
    label: 'Barn',
    route: ERouteOvergangsstønad.Barn,
    localeTekst: 'barnadine.sidetittel',
  },
  {
    path: '/barnas-bosted',
    label: 'Barnas bosted og foreldrenes samværsordning',
    route: ERouteOvergangsstønad.BarnasBosted,
    localeTekst: 'barnasbosted.sidetittel',
  },
];

const GAMLE_STEG_5_6: IRoute[] = [
  {
    path: '/aktivitet',
    label: 'Arbeid, utdanning og andre aktiviteter',
    route: ERouteOvergangsstønad.Aktivitet,
    localeTekst: 'stegtittel.arbeidssituasjon',
  },
  {
    path: '/din-situasjon',
    label: 'Din situasjon',
    route: ERouteOvergangsstønad.DinSituasjon,
    localeTekst: 'stegtittel.dinSituasjon',
  },
];

const NYE_STEG_5_6: IRoute[] = [
  {
    path: '/aktivitet-og-situasjon',
    label: 'NYTT STEG 5-6',
    route: ERouteOvergangsstønad.AktivitetOgSituasjon,
    localeTekst: 'stegtittel.aktivitetOgSituasjon',
  },
];

const FELLESSTEG_ETTER: IRoute[] = [
  {
    path: '/oppsummering',
    label: 'Oppsummering',
    route: ERouteOvergangsstønad.Oppsummering,
    localeTekst: 'oppsummering.sidetittel',
  },
  {
    path: '/dokumentasjon',
    label: 'Dokumentasjon',
    route: ERouteOvergangsstønad.Dokumentasjon,
    localeTekst: 'dokumentasjon.tittel',
  },
  {
    path: '/kvittering',
    label: 'Kvittering',
    route: ERouteOvergangsstønad.Kvittering,
  },
];

export const hentRoutesOvergangsstonad = (brukNyeRegler: boolean): IRoute[] => [
  ...FELLESSTEG_FØR,
  ...(brukNyeRegler ? NYE_STEG_5_6 : GAMLE_STEG_5_6),
  ...FELLESSTEG_ETTER,
];

export const RoutesOvergangsstonad: IRoute[] = hentRoutesOvergangsstonad(false);

export const overgangsstønadForsideUrl = (): string =>
  window.location.origin + process.env.PUBLIC_URL;
