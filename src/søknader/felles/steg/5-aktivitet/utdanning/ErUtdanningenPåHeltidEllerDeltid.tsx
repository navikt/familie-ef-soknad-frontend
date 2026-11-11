import type React from 'react';
import MultiSvarSpørsmål from '../../../../../components/spørsmål/MultiSvarSpørsmål';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import type { ISpørsmål, ISvar } from '../../../../../models/felles/spørsmålogsvar';
import { EUtdanning, type UnderUtdanning } from '../../../../../models/steg/aktivitet/utdanning';
import { hentTekst } from '../../../../../utils/teksthåndtering';
import { heltidEllerDeltidSpm } from './UtdanningConfig';

interface Props {
    utdanning: UnderUtdanning;
    settUtdanning: (utdanning: UnderUtdanning) => void;
}
export const ErUtdanningenPåHeltidEllerDeltid: React.FC<Props> = ({ utdanning, settUtdanning }) => {
    const intl = useLokalIntlContext();

    const settMultiSpørsmål = (spørsmål: ISpørsmål, svar: ISvar) => {
        const søkerVilStudereHeltid = spørsmål.svaralternativer.find(
            svarsalternativ => svarsalternativ.svar_tekst === svar.svar_tekst
        );
        if (
            (spørsmål.søknadid === EUtdanning.heltidEllerDeltid &&
                søkerVilStudereHeltid &&
                utdanning.målMedUtdanning) ||
            utdanning.arbeidsmengde
        ) {
            delete utdanning.arbeidsmengde;
            delete utdanning.målMedUtdanning;
        }
        settUtdanning({
            ...utdanning,
            [spørsmål.søknadid]: {
                spørsmålid: spørsmål.søknadid,
                svarid: svar.id,
                label: hentTekst(spørsmål.tekstid, intl),
                verdi: svar.svar_tekst,
            },
        });
    };
    return (
        <MultiSvarSpørsmål
            spørsmål={heltidEllerDeltidSpm(intl)}
            settSpørsmålOgSvar={settMultiSpørsmål}
            valgtSvar={utdanning.heltidEllerDeltid?.verdi}
            className="toKorteSvar"
        />
    );
};
