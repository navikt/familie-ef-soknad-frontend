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

const GAMLE_STEG_FØR_REGELENDRING_2026: IRoute[] = [
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

const STEG_ETTER_REGELENDRING_2026: IRoute[] = [
  {
    path: '/aktivitet-og-situasjon',
    label: 'Situasjon',
    route: ERouteOvergangsstønad.AktivitetOgSituasjon,
    localeTekst: 'stegtittel.situasjonen',
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

export const hentRoutesOvergangsstonad = (brukRegelendring2026: boolean): IRoute[] => [
  ...FELLESSTEG_FØR,
  ...(brukRegelendring2026 ? STEG_ETTER_REGELENDRING_2026 : GAMLE_STEG_FØR_REGELENDRING_2026),
  ...FELLESSTEG_ETTER,
];

export const RoutesOvergangsstonad: IRoute[] = hentRoutesOvergangsstonad(false);

export const overgangsstønadForsideUrl = (): string =>
  window.location.origin + process.env.PUBLIC_URL;
