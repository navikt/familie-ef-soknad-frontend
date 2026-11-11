import axios, { type AxiosError } from 'axios';
import Environment from '../../Environment';
import {
    arbeidssøkerSkjemaForsideUrl,
    erUrlArbeidssøkerSkjema,
} from '../../søknader/arbeidssøkerskjema/routes/routesArbeidssokerskjema';
import { barnetilsynForsideUrl, erUrlBarnetilsyn } from '../../søknader/barnetilsyn/routing/routesBarnetilsyn';
import { overgangsstønadForsideUrl } from '../../søknader/overgangsstønad/routing/routesOvergangsstonad';
import { erUrlSkolepenger, skolepengerForsideUrl } from '../../søknader/skolepenger/routing/routes';
import { erLokaltMedMock } from '../miljø';

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
        response => {
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

export const verifiserAtBrukerErAutentisert = (settAutentisering: (autentisering: boolean) => void) => {
    if (loggInn()) {
        verifiserInnloggetApi().then(response => {
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
