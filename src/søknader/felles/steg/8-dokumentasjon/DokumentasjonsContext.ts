import constate from 'constate';
import { useState } from 'react';
import { useLocation } from 'react-router';
import type { IRoute } from '../../../../models/routes';
import type { Stønadstype } from '../../../../models/søknad/stønadstyper';
import type { Søknad } from '../../../../models/søknad/søknad';

export interface Props<T extends Søknad> {
    stønadstype: Stønadstype;
    søknad: T;
    oppdaterSøknad: (søknad: T) => void;
    mellomlagreSøknad: (steg: string, oppdatertSøknad: T) => void;
    routes: IRoute[];
}

export const [DokumentasjonsProvider, useDokumentasjon] = constate(
    ({ stønadstype, søknad, oppdaterSøknad, mellomlagreSøknad, routes }: Props<Søknad>) => {
        const location = useLocation();

        const [dokumentasjonsbehov, settDokumentasjonsbehov] = useState(søknad.dokumentasjonsbehov);

        const mellomlagreSteg = () => {
            const oppdatertSøknad = { ...søknad, dokumentasjonsbehov: dokumentasjonsbehov };

            oppdaterSøknad(oppdatertSøknad);

            return mellomlagreSøknad(location.pathname, oppdatertSøknad);
        };

        return {
            stønadstype,
            søknad,
            dokumentasjonsbehov,
            settDokumentasjonsbehov,
            mellomlagreSteg,
            routes,
        };
    }
);
