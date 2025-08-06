import { IRoute } from '../../../models/routes';

export enum ERouteOvergangsstønad {
  Forside = 'Forside',
  OmDeg = 'OmDeg',
  BosituasjonenDin = 'BosituasjonenDin',
  Barn = 'Barn',
  BarnasBosted = 'BarnasBosted',
  Aktivitet = 'Aktivitet',
  DinSituasjon = 'DinSituasjon',
  Oppsummering = 'Oppsummering',
  Dokumentasjon = 'Dokumentasjon',
  Kvittering = 'Kvittering',
}

export const RoutesOvergangsstonad: IRoute[] = [
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

export const overgangsstønadForsideUrl = (): string =>
  window.location.origin + process.env.PUBLIC_URL;
