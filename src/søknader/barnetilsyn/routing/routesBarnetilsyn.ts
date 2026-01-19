import { IRoute } from '../../../models/routes';
import { hentPath } from '../../../utils/routing';

const PUBLIC_URL = process.env.PUBLIC_URL || '/';

export enum ERouteBarnetilsyn {
  Forside = 'Forside',
  Gjenbruk = 'Gjenbruk',
  OmDeg = 'OmDeg',
  BosituasjonenDin = 'BosituasjonenDin',
  BarnaDine = 'BarnaDine',
  BostedOgSamvær = 'BostedOgSamvær',
  Aktivitet = 'Aktivitet',
  Barnepass = 'Barnepass',
  Oppsummering = 'Oppsummering',
  Dokumentasjon = 'Dokumentasjon',
  Kvittering = 'Kvittering',
}

const alleRoutes: IRoute[] = [
  { path: '/barnetilsyn', label: 'Forside', route: ERouteBarnetilsyn.Forside },
  {
    path: '/barnetilsyn/gjenbruk',
    label: 'Gjenbruk',
    route: ERouteBarnetilsyn.Gjenbruk,
  },
  {
    path: '/barnetilsyn/om-deg',
    label: 'Om deg',
    route: ERouteBarnetilsyn.OmDeg,
    localeTekst: 'stegtittel.omDeg',
  },
  {
    path: '/barnetilsyn/bosituasjon',
    label: 'Bosituasjonen din',
    route: ERouteBarnetilsyn.BosituasjonenDin,
    localeTekst: 'stegtittel.bosituasjon',
  },
  {
    path: '/barnetilsyn/barn',
    label: 'Barna dine',
    route: ERouteBarnetilsyn.BarnaDine,
    localeTekst: 'barnadine.sidetittel',
  },
  {
    path: '/barnetilsyn/barnas-bosted',
    label: 'Barnas bosted og foreldrenes samværsordning',
    route: ERouteBarnetilsyn.BostedOgSamvær,
    localeTekst: 'barnasbosted.sidetittel',
  },
  {
    path: '/barnetilsyn/aktivitet',
    label: 'Arbeidssituasjonen din',
    route: ERouteBarnetilsyn.Aktivitet,
    localeTekst: 'stegtittel.arbeidssituasjon.barnetilsyn',
  },
  {
    path: '/barnetilsyn/barnepass',
    label: 'Om barnepassordningen',
    route: ERouteBarnetilsyn.Barnepass,
    localeTekst: 'barnepass.sidetittel',
  },
  {
    path: '/barnetilsyn/oppsummering',
    label: 'Oppsummering',
    route: ERouteBarnetilsyn.Oppsummering,
    localeTekst: 'oppsummering.sidetittel',
  },
  {
    path: '/barnetilsyn/dokumentasjon',
    label: 'Dokumentasjon',
    route: ERouteBarnetilsyn.Dokumentasjon,
    localeTekst: 'dokumentasjon.tittel',
  },
  {
    path: '/barnetilsyn/kvittering',
    label: 'Kvittering',
    route: ERouteBarnetilsyn.Kvittering,
  },
];

export const RoutesBarnetilsyn: IRoute[] = alleRoutes;

export const filtrerRoutesUtenGjenbruk = (routes: IRoute[]): IRoute[] =>
  routes.filter((route) => route.route !== ERouteBarnetilsyn.Gjenbruk);

export const erUrlBarnetilsyn = (): boolean => {
  return window.location.href.includes(
    PUBLIC_URL + hentPath(RoutesBarnetilsyn, ERouteBarnetilsyn.Forside)
  );
};

export const barnetilsynForsideUrl = (): string =>
  window.location.origin + PUBLIC_URL + hentPath(RoutesBarnetilsyn, ERouteBarnetilsyn.Forside);
