import axios, { AxiosError } from 'axios';
import Environment from '../../Environment';
import {
  arbeidssøkerSkjemaForsideUrl,
  erUrlArbeidssøkerSkjema,
} from '../../søknader/arbeidssøkerskjema/routes/routesArbeidssokerskjema';
import { overgangsstønadForsideUrl } from '../../søknader/overgangsstønad/routing/routesOvergangsstonad';
import { erLokaltMedMock } from '../miljø';
import {
  barnetilsynForsideUrl,
  erUrlBarnetilsyn,
} from '../../søknader/barnetilsyn/routing/routesBarnetilsyn';
import { erUrlSkolepenger, skolepengerForsideUrl } from '../../søknader/skolepenger/routing/routes';

const er401Feil = (error: AxiosError) => error && error.response && error.response.status === 401;

const loggInn = () => !erLokaltMedMock();

const getLoginUrl = () => Environment().wonderwallUrl + getRedirectUrl();

const getRedirectUrl = () => {
  if (erUrlArbeidssøkerSkjema()) {
    return arbeidssøkerSkjemaForsideUrl();
  } else if (erUrlBarnetilsyn()) {
    return barnetilsynForsideUrl();
  } else if (erUrlSkolepenger()) {
    return skolepengerForsideUrl();
  }
  return overgangsstønadForsideUrl();
};

export const autentiseringsInterceptor = () => {
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      if (er401Feil(error) && loggInn()) {
        window.location.href = getLoginUrl();
      } else {
        throw error;
      }
    }
  );
};

export const verifiserAtBrukerErAutentisert = (
  settAutentisering: (autentisering: boolean) => void
) => {
  if (loggInn()) {
    return verifiserInnloggetApi().then((response) => {
      if (response && 200 === response.status) {
        settAutentisering(true);
      }
    });
  } else {
    settAutentisering(true);
  }
};

const verifiserInnloggetApi = () => {
  return axios.get(`${Environment().apiProxyUrl}/api/innlogget`, {
    withCredentials: true,
  });
};
