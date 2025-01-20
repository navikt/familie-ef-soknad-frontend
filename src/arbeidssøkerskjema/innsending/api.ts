import axios from 'axios';
import Environment from '../../Environment';

export const sendInnSkjema = async (skjema: object) => {
  const response = await axios.post(
    `${Environment().apiProxyUrl}/api/registrerarbeid`,
    skjema,
    {
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      withCredentials: true,
    }
  );
  return response.data;
};

export const sendInnArbeidssøkerSkjema = async (skjema: object) => {
  const response = await axios.post(
    `${Environment().apiProxyUrl}/api/soknadskvittering/arbeidssoker`,
    skjema,
    {
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      withCredentials: true,
    }
  );
  return response.data;
};
