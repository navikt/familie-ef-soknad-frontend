import constate from 'constate';
import { useState } from 'react';
import { useLocation } from 'react-router';
import type { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import type { IAktivitet } from '../../../../models/steg/aktivitet/aktivitet';
import type { SøknadOvergangsstønad } from '../../models/søknad';

export interface Props {
    søknad: SøknadOvergangsstønad;
    oppdaterSøknad: (søknad: SøknadOvergangsstønad) => void;
    mellomlagreSøknad: (steg: string, oppdatertSøknad: SøknadOvergangsstønad) => void;
    settDokumentasjonsbehov: (spørsmål: ISpørsmål, valgtSvar: ISvar, erHuketAv?: boolean) => void;
}

export const [AktivitetProvider, useAktivitet] = constate(
    ({ søknad, oppdaterSøknad, mellomlagreSøknad, settDokumentasjonsbehov }: Props) => {
        const location = useLocation();

        const [aktivitet, settAktivitet] = useState<IAktivitet>(søknad?.aktivitet);

        const mellomlagreSteg = () => {
            const oppdatertAktivitet = { ...aktivitet };

            const oppdatertSøknad = { ...søknad, aktivitet: oppdatertAktivitet };

            oppdaterSøknad(oppdatertSøknad);

            return mellomlagreSøknad(location.pathname, oppdatertSøknad);
        };

        return {
            aktivitet,
            settAktivitet,
            søknad,
            mellomlagreSteg,
            settDokumentasjonsbehov,
        };
    }
);
