import { IRoute } from '../../../models/routes';
import { hentPath } from '../../../utils/routing';

const PUBLIC_URL = process.env.PUBLIC_URL || '/';

export enum ERouteArbeidssøkerskjema {
  Forside = 'Forside',
  Spørsmål = 'Spørsmål',
  Oppsummering = 'Oppsummering',
  Kvittering = 'Kvittering',
}

export const RoutesArbeidssokerskjema: IRoute[] = [
  {
    path: '/arbeidssoker',
    label: 'Forside',
    route: ERouteArbeidssøkerskjema.Forside,
  },
  {
    path: '/arbeidssoker/sporsmal',
    label: 'Spørsmål',
    route: ERouteArbeidssøkerskjema.Spørsmål,
    localeTeskt: 'skjema.tittel.omarbeidssøker',
  },
  {
    path: '/arbeidssoker/oppsummering',
    label: 'Oppsummering',
    route: ERouteArbeidssøkerskjema.Oppsummering,
    localeTeskt: 'oppsummering.sidetittel',
  },
  {
    path: '/arbeidssoker/kvittering',
    label: 'Kvittering',
    route: ERouteArbeidssøkerskjema.Kvittering,
  },
];

export const erUrlArbeidssøkerSkjema = (): boolean => {
  return window.location.href.includes(
    PUBLIC_URL + hentPath(RoutesArbeidssokerskjema, ERouteArbeidssøkerskjema.Forside)
  );
};

export const arbeidssøkerSkjemaForsideUrl = (): string =>
  window.location.origin +
  PUBLIC_URL +
  hentPath(RoutesArbeidssokerskjema, ERouteArbeidssøkerskjema.Forside);
