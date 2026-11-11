import constate from 'constate';
import { useState } from 'react';
import { useLocation } from 'react-router';
import type { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import type { DetaljertUtdanning } from '../../models/detaljertUtdanning';
import type { SøknadSkolepenger } from '../../models/søknad';

export interface Props {
    søknad: SøknadSkolepenger;
    oppdaterSøknad: (søknad: SøknadSkolepenger) => void;
    mellomlagreSøknad: (steg: string, oppdatertSøknad: SøknadSkolepenger) => void;
    settDokumentasjonsbehov: (spørsmål: ISpørsmål, valgtSvar: ISvar, erHuketAv?: boolean) => void;
}

export const [UtdanningSituasjonProvider, useUtdanningSituasjon] = constate(
    ({ søknad, oppdaterSøknad, mellomlagreSøknad, settDokumentasjonsbehov }: Props) => {
        const location = useLocation();

        const [utdanning, settUtdanning] = useState<DetaljertUtdanning>(søknad?.utdanning);

        const mellomlagreSteg = () => {
            const oppdatertUtdanning = { ...utdanning };

            const oppdatertSøknad = { ...søknad, utdanning: oppdatertUtdanning };

            oppdaterSøknad(oppdatertSøknad);

            return mellomlagreSøknad(location.pathname, oppdatertSøknad);
        };

        return {
            utdanning,
            settUtdanning,
            søknad,
            mellomlagreSteg,
            settDokumentasjonsbehov,
        };
    }
);
