import axios from 'axios';
import Environment from '../../../Environment';

export const sendInnArbeidssøkerSkjema = async (skjema: object) => {
    const response = await axios.post(`${Environment().apiProxyUrl}/api/soknad/arbeidssoker`, skjema, {
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        withCredentials: true,
    });
    return response.data;
};
