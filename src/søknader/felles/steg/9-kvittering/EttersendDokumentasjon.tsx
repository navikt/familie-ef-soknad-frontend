import { BodyShort, Heading, VStack } from '@navikt/ds-react';
import type { FC } from 'react';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import type { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { hentHTMLTekst, hentTekst } from '../../../../utils/teksthåndtering';

interface Props {
    stønadstype: Stønadstype;
}

export const EttersendDokumentasjon: FC<Props> = ({ stønadstype }) => {
    const intl = useLokalIntlContext();
    return (
        <VStack gap={'space-16'}>
            <Heading size="small" level="3">
                {hentTekst('dokumentasjon.ettersend.tittel', intl)}
            </Heading>
            <BodyShort>{hentHTMLTekst(`dokumentasjon.ettersend.tekst.${stønadstype}`, intl)}</BodyShort>
        </VStack>
    );
};
