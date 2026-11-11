import constate from 'constate';
import { useState } from 'react';
import { useLocation } from 'react-router';
import type { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import type { IRoute } from '../../../../models/routes';
import type { Stønadstype } from '../../../../models/søknad/stønadstyper';
import type { MellomlagretSøknad, Søknad } from '../../../../models/søknad/søknad';
import { sanerOmDegSteg } from './sanerOmDegSteg';

export interface Props<T extends Søknad> {
    stønadstype: Stønadstype;
    søknad: T;
    oppdaterSøknad: (søknad: T) => void;
    mellomlagretSøknad: MellomlagretSøknad | undefined;
    mellomlagreSøknad: (steg: string, oppdatertSøknad: T) => void;
    routes: IRoute[];
    pathOppsummering: string | undefined;
    settDokumentasjonsbehov: (spørsmål: ISpørsmål, valgtSvar: ISvar, erHuketAv?: boolean) => void;
}

export const [OmDegProvider, useOmDeg] = constate(
    ({
        stønadstype,
        søknad,
        oppdaterSøknad,
        mellomlagreSøknad,
        routes,
        pathOppsummering,
        settDokumentasjonsbehov,
    }: Props<Søknad>) => {
        const location = useLocation();

        const [medlemskap, settMedlemskap] = useState(søknad.medlemskap);
        const [sivilstatus, settSivilstatus] = useState(søknad.sivilstatus);
        const [søkerBorPåRegistrertAdresse, settSøkerBorPåRegistrertAdresse] = useState(
            søknad.søkerBorPåRegistrertAdresse
        );
        const [adresseopplysninger, settAdresseopplysninger] = useState(søknad.adresseopplysninger);

        const mellomlagreSteg = () => {
            const oppdatertSøknad = sanerOmDegSteg(
                søknad,
                sivilstatus,
                medlemskap,
                adresseopplysninger,
                søkerBorPåRegistrertAdresse
            );

            oppdaterSøknad(oppdatertSøknad);

            return mellomlagreSøknad(location.pathname, oppdatertSøknad);
        };

        return {
            søkerBorPåRegistrertAdresse,
            settSøkerBorPåRegistrertAdresse,
            adresseopplysninger,
            settAdresseopplysninger,
            sivilstatus,
            settSivilstatus,
            medlemskap,
            settMedlemskap,
            mellomlagreSteg,
            stønadstype,
            routes,
            pathOppsummering,
            settDokumentasjonsbehov,
            søknad,
            oppdaterSøknad,
        };
    }
);
