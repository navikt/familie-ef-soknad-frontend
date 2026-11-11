import type { ERouteArbeidssøkerskjema } from '../søknader/arbeidssøkerskjema/routes/routesArbeidssokerskjema';
import type { ERouteBarnetilsyn } from '../søknader/barnetilsyn/routing/routesBarnetilsyn';
import type { ERouteOvergangsstønad } from '../søknader/overgangsstønad/routing/routesOvergangsstonad';
import type { ERouteSkolepenger } from '../søknader/skolepenger/routing/routes';

export type RouteType = ERouteSkolepenger | ERouteBarnetilsyn | ERouteOvergangsstønad | ERouteArbeidssøkerskjema;

export interface IRoute {
    route: RouteType;
    path: string;
    label: string;
    localeTekst?: string;
}
