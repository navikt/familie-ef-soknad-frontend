import { BodyShort, VStack } from '@navikt/ds-react';
import type React from 'react';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { dagensDato, formatMånederTilbake } from '../../../../utils/dato';
import { hentTekst, hentTekstMedEnVariabel } from '../../../../utils/teksthåndtering';

export const HjelpetekstSøkerFraBestemtMåned: React.FC = () => {
    const intl = useLokalIntlContext();

    const hjelpetekstFørsteAvsnitt = hentTekstMedEnVariabel(
        'søkerFraBestemtMåned.hjelpetekst-innhold.overgangsstønad-del1',
        intl,
        formatMånederTilbake(dagensDato, 3)
    );
    const hjelpetekstAndreAvsnitt = hentTekstMedEnVariabel(
        'søkerFraBestemtMåned.hjelpetekst-innhold.overgangsstønad-del2',
        intl,
        formatMånederTilbake(dagensDato, 5)
    );
    const hjelpetekstTredjeAvsnitt = hentTekst('søkerFraBestemtMåned.hjelpetekst-innhold.overgangsstønad-del3', intl);

    return (
        <VStack gap={'space-16'}>
            <BodyShort>{hjelpetekstFørsteAvsnitt}</BodyShort>
            <BodyShort>{hjelpetekstAndreAvsnitt}</BodyShort>
            <BodyShort>{hjelpetekstTredjeAvsnitt}</BodyShort>
        </VStack>
    );
};
