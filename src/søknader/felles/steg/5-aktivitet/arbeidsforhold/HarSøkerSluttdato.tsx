import { VStack } from '@navikt/ds-react';
import type React from 'react';
import { Datovelger } from '../../../../../components/dato/Datovelger';
import { GyldigeDatoer } from '../../../../../components/dato/GyldigeDatoer';
import JaNeiSpørsmål from '../../../../../components/spørsmål/JaNeiSpørsmål';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import type { ISpørsmål, ISvar } from '../../../../../models/felles/spørsmålogsvar';
import { EArbeidsgiver, type IArbeidsgiver } from '../../../../../models/steg/aktivitet/arbeidsgiver';
import { hentBooleanFraValgtSvar } from '../../../../../utils/spørsmålogsvar';
import { hentTekst } from '../../../../../utils/teksthåndtering';
import { harDuSluttdato } from './ArbeidsgiverConfig';

interface Props {
    arbeidsgiver: IArbeidsgiver;
    settArbeidsgiver: (arbeidsgiver: IArbeidsgiver) => void;
}

export const HarSøkerSluttdato: React.FC<Props> = ({ arbeidsgiver, settArbeidsgiver }) => {
    const intl = useLokalIntlContext();

    const settDato = (dato: string) => {
        dato !== null &&
            settArbeidsgiver({
                ...arbeidsgiver,
                [EArbeidsgiver.sluttdato]: {
                    label: hentTekst(sluttdatoTekstid, intl),
                    verdi: dato,
                },
            });
    };

    const settHarSluttDato = (spørsmål: ISpørsmål, valgtSvar: ISvar) => {
        const svar: boolean = hentBooleanFraValgtSvar(valgtSvar);
        const harSluttDatoFelt = {
            spørsmålid: spørsmål.søknadid,
            svarid: valgtSvar.id,
            label: hentTekst(spørsmål.tekstid, intl),
            verdi: svar,
        };
        if (svar === false && arbeidsgiver.sluttdato) {
            const endretArbeidsgiver = arbeidsgiver;
            delete endretArbeidsgiver.sluttdato;
            settArbeidsgiver({
                ...endretArbeidsgiver,
                [EArbeidsgiver.harSluttDato]: harSluttDatoFelt,
            });
        } else {
            settArbeidsgiver({
                ...arbeidsgiver,
                [EArbeidsgiver.harSluttDato]: harSluttDatoFelt,
            });
        }
    };

    const sluttdatoTekstid = 'arbeidsforhold.datovelger.sluttdato';

    return (
        <VStack gap={'space-16'}>
            <JaNeiSpørsmål
                spørsmål={harDuSluttdato(intl)}
                onChange={settHarSluttDato}
                valgtSvar={arbeidsgiver.harSluttDato?.verdi}
            />
            {arbeidsgiver.harSluttDato?.verdi === true && (
                <Datovelger
                    valgtDato={arbeidsgiver.sluttdato?.verdi}
                    tekstid={sluttdatoTekstid}
                    gyldigeDatoer={GyldigeDatoer.Fremtidige}
                    settDato={e => settDato(e)}
                />
            )}
        </VStack>
    );
};
