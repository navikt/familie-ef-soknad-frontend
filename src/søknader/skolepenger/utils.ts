import { hentPath } from '../../utils/routing';
import { ERouteSkolepenger, RoutesSkolepenger } from './routing/routes';

export const hentPathSkolepengerOppsummering = hentPath(
  RoutesSkolepenger,
  ERouteSkolepenger.Oppsummering
);
