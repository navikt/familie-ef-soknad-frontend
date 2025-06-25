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

export const RoutesBarnetilsyn: IRoute[] = [
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
    localeTeskt: 'stegtittel.omDeg',
  },
  {
    path: '/barnetilsyn/bosituasjon',
    label: 'Bosituasjonen din',
    route: ERouteBarnetilsyn.BosituasjonenDin,
    localeTeskt: 'stegtittel.bosituasjon',
  },
  {
    path: '/barnetilsyn/barn',
    label: 'Barna dine',
    route: ERouteBarnetilsyn.BarnaDine,
    localeTeskt: 'barnadine.sidetittel',
  },
  {
    path: '/barnetilsyn/barnas-bosted',
    label: 'Barnas bosted og foreldrenes samværsordning',
    route: ERouteBarnetilsyn.BostedOgSamvær,
    localeTeskt: 'barnasbosted.sidetittel',
  },
  {
    path: '/barnetilsyn/aktivitet',
    label: 'Arbeidssituasjonen din',
    route: ERouteBarnetilsyn.Aktivitet,
    localeTeskt: 'stegtittel.arbeidssituasjon.barnetilsyn',
  },
  {
    path: '/barnetilsyn/barnepass',
    label: 'Om barnepassordningen',
    route: ERouteBarnetilsyn.Barnepass,
    localeTeskt: 'barnepass.sidetittel',
  },
  {
    path: '/barnetilsyn/oppsummering',
    label: 'Oppsummering',
    route: ERouteBarnetilsyn.Oppsummering,
    localeTeskt: 'oppsummering.sidetittel',
  },
  {
    path: '/barnetilsyn/dokumentasjon',
    label: 'Dokumentasjon',
    route: ERouteBarnetilsyn.Dokumentasjon,
    localeTeskt: 'dokumentasjon.tittel',
  },
  {
    path: '/barnetilsyn/kvittering',
    label: 'Kvittering',
    route: ERouteBarnetilsyn.Kvittering,
  },
];

export const erUrlBarnetilsyn = (): boolean => {
  return window.location.href.includes(
    PUBLIC_URL + hentPath(RoutesBarnetilsyn, ERouteBarnetilsyn.Forside)
  );
};

export const barnetilsynForsideUrl = (): string =>
  window.location.origin + PUBLIC_URL + hentPath(RoutesBarnetilsyn, ERouteBarnetilsyn.Forside);
