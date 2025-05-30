import { hentPath } from '../../utils/routing';
import {
  ERouteOvergangsstønad,
  RoutesOvergangsstonad,
} from './routing/routesOvergangsstonad';

export const hentPathOvergangsstønadOppsummering = hentPath(
  RoutesOvergangsstonad,
  ERouteOvergangsstønad.Oppsummering
);
