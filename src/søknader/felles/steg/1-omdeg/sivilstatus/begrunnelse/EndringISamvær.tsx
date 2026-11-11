import type React from 'react';
import { Datovelger } from '../../../../../../components/dato/Datovelger';
import { GyldigeDatoer } from '../../../../../../components/dato/GyldigeDatoer';
import { useLokalIntlContext } from '../../../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../../../utils/teksthåndtering';
import { useOmDeg } from '../../OmDegContext';

export const EndringISamvær: React.FC = () => {
    const intl = useLokalIntlContext();

    const { sivilstatus, settSivilstatus } = useOmDeg();
    const { datoEndretSamvær } = sivilstatus;
    const datovelgerTekstid = 'sivilstatus.datovelger.endring';

    const settDatoEndretSamvær = (date: string, tekstid: string): void => {
        settSivilstatus({
            ...sivilstatus,
            datoEndretSamvær: {
                label: hentTekst(tekstid, intl),
                verdi: date,
            },
        });
    };

    return (
        <Datovelger
            settDato={e => settDatoEndretSamvær(e, datovelgerTekstid)}
            valgtDato={datoEndretSamvær ? datoEndretSamvær.verdi : undefined}
            tekstid={datovelgerTekstid}
            gyldigeDatoer={GyldigeDatoer.Alle}
        />
    );
};
