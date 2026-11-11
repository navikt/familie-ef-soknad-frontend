import { VStack } from '@navikt/ds-react';
import type React from 'react';
import { TextFieldMedBredde } from '../../../../../components/TextFieldMedBredde';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { EUtdanning, type UnderUtdanning } from '../../../../../models/steg/aktivitet/utdanning';
import { hentTekst } from '../../../../../utils/teksthåndtering';
import { linjeKursGrad, skoleUtdanningssted } from './UtdanningConfig';

interface Props {
    utdanning: UnderUtdanning;
    oppdaterUtdanning: (nøkkel: EUtdanning, label: string, verdi: string) => void;
}

export const SkoleOgLinje: React.FC<Props> = ({ utdanning, oppdaterUtdanning }) => {
    const intl = useLokalIntlContext();

    const settInputFelt = (nøkkel: EUtdanning, label: string, e: React.FormEvent<HTMLInputElement>) => {
        oppdaterUtdanning(nøkkel, label, e.currentTarget.value);
    };

    const skoleUtdanningstedLabel = hentTekst(skoleUtdanningssted.label_tekstid, intl);
    const linjeKursGradLabel = hentTekst(linjeKursGrad.label_tekstid, intl);

    return (
        <VStack gap={'space-32'}>
            <TextFieldMedBredde
                key={skoleUtdanningssted.id}
                label={skoleUtdanningstedLabel}
                type="text"
                bredde={'XL'}
                value={utdanning?.skoleUtdanningssted?.verdi ? utdanning?.skoleUtdanningssted?.verdi : ''}
                onChange={e => settInputFelt(EUtdanning.skoleUtdanningssted, skoleUtdanningstedLabel, e)}
            />
            {utdanning?.skoleUtdanningssted?.verdi && (
                <TextFieldMedBredde
                    key={linjeKursGrad.id}
                    label={linjeKursGradLabel}
                    type="text"
                    bredde={'XL'}
                    onChange={e => settInputFelt(EUtdanning.linjeKursGrad, linjeKursGradLabel, e)}
                    value={utdanning?.linjeKursGrad?.verdi ? utdanning?.linjeKursGrad?.verdi : ''}
                />
            )}
        </VStack>
    );
};
