import { ERouteSkolepenger } from '../søknader/skolepenger/routing/routes';
import { ERouteBarnetilsyn } from '../søknader/barnetilsyn/routing/routesBarnetilsyn';
import { ERouteArbeidssøkerskjema } from '../søknader/arbeidssøkerskjema/routes/routesArbeidssokerskjema';
import { ERouteOvergangsstønad } from '../søknader/overgangsstønad/routing/routesOvergangsstonad';

export type RouteType =
  | ERouteSkolepenger
  | ERouteBarnetilsyn
  | ERouteOvergangsstønad
  | ERouteArbeidssøkerskjema;

export interface IRoute {
  route: RouteType;
  path: string;
  label: string;
  localeTeskt?: string;
}
