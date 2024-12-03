import axios from 'axios';
import Environment from '../Environment';
import { IBarn } from '../models/steg/barn';

export const sendInnSøknad = (søknad: object) => {
  return axios
    .post(`${Environment().apiProxyUrl}/api/soknad`, søknad, {
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      withCredentials: true,
    })
    .then((response: { data: any }) => {
      return response.data;
    });
};

export const sendInnSøknadFamiliePdf = (søknad: object) => {
  return axios
    .post(
      `${Environment().apiProxyUrl}/api/soknadskvittering/overgangsstonad`,
      søknad,
      {
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        withCredentials: true,
      }
    )
    .then((response: { data: any }) => {
      return response.data;
    });
};

export const sendInnBarnetilsynSøknad = (søknad: object) => {
  return axios
    .post(`${Environment().apiProxyUrl}/api/soknadbarnetilsyn`, søknad, {
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      withCredentials: true,
    })
    .then((response: { data: any }) => {
      return response.data;
    });
};

export const sendInnSkolepengerSøknad = (søknad: object) => {
  return axios
    .post(`${Environment().apiProxyUrl}/api/soknad/skolepenger`, søknad, {
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      withCredentials: true,
    })
    .then((response: { data: any }) => {
      return response.data;
    });
};

export const mapBarnUtenBarnepass = (barneliste: IBarn[]) => {
  return barneliste.map((barn) => {
    const kopiAvBarn = { ...barn };
    delete kopiAvBarn.skalHaBarnepass;
    return kopiAvBarn;
  });
};

export const mapBarnTilEntenIdentEllerFødselsdato = (barneliste: IBarn[]) => {
  return barneliste.map((barn) => {
    if (barn.lagtTil) {
      if (barn.fødselsdato && !barn.fødselsdato.verdi) {
        const endretBarn: IBarn = {
          ...barn,
          fødselsdato: { ...barn.fødselsdato, verdi: '' },
        };
        return endretBarn;
      }
    }
    return barn;
  });
};
