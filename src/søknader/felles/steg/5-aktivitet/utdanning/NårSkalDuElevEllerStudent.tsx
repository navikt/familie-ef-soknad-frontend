import type React from 'react';
import { useEffect } from 'react';
import { GyldigeDatoer } from '../../../../../components/dato/GyldigeDatoer';
import { PeriodeDatovelgere } from '../../../../../components/dato/PeriodeDatovelger';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { tomPeriode } from '../../../../../helpers/tommeSøknadsfelter';
import type { EPeriode } from '../../../../../models/felles/periode';
import type { UnderUtdanning } from '../../../../../models/steg/aktivitet/utdanning';
import { hentTekst } from '../../../../../utils/teksthåndtering';

interface Props {
    utdanning: UnderUtdanning;
    settUtdanning: (utdanning: UnderUtdanning) => void;
}

export const NårSkalDuVæreElevEllerStudent: React.FC<Props> = ({ utdanning, settUtdanning }) => {
    const intl = useLokalIntlContext();
    useEffect(() => {
        if (!utdanning.periode) {
            settUtdanning({ ...utdanning, periode: tomPeriode });
        }
    }, []);

    const settPeriode = (nøkkel: EPeriode, dato?: string): void => {
        utdanning.periode &&
            settUtdanning({
                ...utdanning,
                periode: {
                    ...utdanning.periode,
                    label: hentTekst('utdanning.datovelger.studieperiode.fremtidig', intl),
                    [nøkkel]: {
                        label: hentTekst('periode.' + nøkkel, intl),
                        verdi: dato,
                    },
                },
            });
    };

    return (
        <PeriodeDatovelgere
            tekst={hentTekst('utdanning.datovelger.studieperiode.fremtidig', intl)}
            periode={utdanning.periode ? utdanning.periode : tomPeriode}
            settDato={settPeriode}
            gyldigeDatoer={GyldigeDatoer.Alle}
        />
    );
};
