import { BodyShort, Heading, Link, VStack } from '@navikt/ds-react';
import type { FC } from 'react';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { hentHTMLTekst, hentTekst } from '../../../../utils/teksthåndtering';

export const TilleggsstønaderArbeidssøker: FC = () => {
    const intl = useLokalIntlContext();
    return (
        <VStack gap={'space-16'}>
            <Heading size="small" level="4">
                {hentTekst('kvittering.tittel.tilleggsstønader.arbeidssøker', intl)}
            </Heading>
            <BodyShort>{hentHTMLTekst('kvittering.beskrivelse.tilleggsstønader.arbeidssøker', intl)}</BodyShort>
            <BodyShort>
                <Link href={'https://www.nav.no/tilleggsstonader-enslig'}>
                    {hentTekst('kvittering.lenke.tilleggsstønader.arbeidssøker', intl)}
                </Link>
            </BodyShort>
            <BodyShort>
                <Link href={'https://www.nav.no/soknader/nb/person/arbeid/tilleggsstonader'}>
                    {hentTekst('kvittering.knapp.tilleggsstønader.arbeidssøker', intl)}
                </Link>
            </BodyShort>
        </VStack>
    );
};
