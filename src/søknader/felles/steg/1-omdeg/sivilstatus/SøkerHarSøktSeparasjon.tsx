import { Alert, VStack } from '@navikt/ds-react';
import type React from 'react';
import { Datovelger } from '../../../../../components/dato/Datovelger';
import { GyldigeDatoer } from '../../../../../components/dato/GyldigeDatoer';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../../utils/teksthåndtering';
import { useOmDeg } from '../OmDegContext';

export const SøkerHarSøktSeparasjon: React.FC = () => {
    const { sivilstatus, settSivilstatus } = useOmDeg();
    const { datoSøktSeparasjon } = sivilstatus;
    const datovelgerTekstid = 'sivilstatus.datovelger.søktSeparasjon';
    const intl = useLokalIntlContext();

    const settDatoSøktSeparasjon = (date: string, tekstid: string): void => {
        settSivilstatus({
            ...sivilstatus,
            datoSøktSeparasjon: {
                label: hentTekst(tekstid, intl),
                verdi: date,
            },
        });
    };

    return (
        <VStack gap={'space-24'}>
            <Datovelger
                settDato={e => settDatoSøktSeparasjon(e, datovelgerTekstid)}
                valgtDato={datoSøktSeparasjon ? datoSøktSeparasjon.verdi : undefined}
                tekstid={datovelgerTekstid}
                gyldigeDatoer={GyldigeDatoer.Tidligere}
            />

            <Alert variant={'info'} size={'small'} inline>
                {hentTekst('sivilstatus.alert-info.søktSeparasjon', intl)}
            </Alert>
        </VStack>
    );
};
