import { BodyShort, Label, Textarea, VStack } from '@navikt/ds-react';
import type React from 'react';
import { AlertStripeDokumentasjon } from '../../../../../components/AlertstripeDokumentasjon';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { EUtdanning, type UnderUtdanning } from '../../../../../models/steg/aktivitet/utdanning';
import type { Stønadstype } from '../../../../../models/søknad/stønadstyper';
import { hentHTMLTekst, hentTekst } from '../../../../../utils/teksthåndtering';

interface Props {
    utdanning: UnderUtdanning;
    oppdaterUtdanning: (nøkkel: EUtdanning, label: string, verdi: string) => void;
    stønadstype: Stønadstype;
}

export const MålMedUtdanningen: React.FC<Props> = ({ utdanning, oppdaterUtdanning, stønadstype }) => {
    const intl = useLokalIntlContext();

    const settMålMedUtdanning = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        oppdaterUtdanning(EUtdanning.målMedUtdanning, målMedUtdanningLabel, e.currentTarget.value);
    };

    const målMedUtdanningLabel = hentTekst('utdanning.spm.mål', intl);

    return (
        <VStack>
            <Textarea
                autoComplete={'off'}
                label={målMedUtdanningLabel}
                value={utdanning.målMedUtdanning?.verdi ? utdanning.målMedUtdanning?.verdi : ''}
                maxLength={1000}
                onChange={e => settMålMedUtdanning(e)}
            />

            <AlertStripeDokumentasjon>
                <Label as="p"> {hentTekst('utdanning.alert-tittel.mål', intl)} </Label>
                <BodyShort size={'small'}>
                    {hentHTMLTekst(`utdanning.alert-beskrivelse.mål.${stønadstype}`, intl)}
                </BodyShort>
            </AlertStripeDokumentasjon>
        </VStack>
    );
};
