import { hentPath } from '../../utils/routing';
import { ERouteOvergangsstønad, RoutesOvergangsstonad } from './routing/routesOvergangsstonad';

export const pathOppsummeringOvergangsstønad = hentPath(
  RoutesOvergangsstonad,
  ERouteOvergangsstønad.Oppsummering
);
