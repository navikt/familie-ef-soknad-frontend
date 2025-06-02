import { hentPath } from '../../utils/routing';
import {
  ERouteBarnetilsyn,
  RoutesBarnetilsyn,
} from './routing/routesBarnetilsyn';

export const hentPathBarnetilsynOppsummering = hentPath(
  RoutesBarnetilsyn,
  ERouteBarnetilsyn.Oppsummering
);
