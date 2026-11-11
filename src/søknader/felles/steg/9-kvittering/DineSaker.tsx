import { BodyShort, VStack } from '@navikt/ds-react';
import type { FC } from 'react';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { hentHTMLTekst, hentTekst } from '../../../../utils/teksthåndtering';

export const DineSaker: FC = () => {
    const intl = useLokalIntlContext();
    return (
        <VStack gap={'space-16'}>
            <BodyShort>{hentTekst('kvittering.tekst.altViTrenger', intl)}</BodyShort>
            <BodyShort>{hentHTMLTekst('kvittering.tekst.dineSaker', intl)}</BodyShort>
        </VStack>
    );
};
