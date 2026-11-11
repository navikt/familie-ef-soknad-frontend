import { BodyShort, Heading, Link, VStack } from '@navikt/ds-react';
import type { FC } from 'react';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { hentHTMLTekst, hentTekst } from '../../../../utils/teksthåndtering';

export const TilleggsstønaderHarAktivitet: FC = () => {
    const intl = useLokalIntlContext();
    return (
        <VStack gap={'space-16'}>
            <Heading size="small" level="4">
                {hentTekst('kvittering.tittel.tilleggsstønader.aktivitetskrav', intl)}
            </Heading>
            <BodyShort>{hentHTMLTekst('kvittering.beskrivelse.tilleggsstønader.aktivitetskrav', intl)}</BodyShort>
            <BodyShort>
                <Link href={'https://www.nav.no/barnetilsyn-enslig'}>
                    {hentTekst('kvittering.lenke.tilleggsstønader.aktivitetskrav', intl)}
                </Link>
            </BodyShort>
            <BodyShort>
                <Link href={'https://www.nav.no/soknader/nb/person/familie/enslig-mor-eller-far#NAV150002'}>
                    {hentTekst('kvittering.knapp.tilleggsstønader.aktivitetskrav', intl)}
                </Link>
            </BodyShort>
        </VStack>
    );
};
