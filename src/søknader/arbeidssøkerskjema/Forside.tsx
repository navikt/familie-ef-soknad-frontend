import { BodyShort, Box, Heading, VStack } from '@navikt/ds-react';
import type React from 'react';
import { DisclaimerBoks } from '../../components/forside/DisclaimerBoks';
import { VeilederBoks } from '../../components/forside/VeilederBoks';
import { KnappLocaleTekstOgNavigate } from '../../components/knapper/KnappLocaleTekstOgNavigate';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { useSpråkValg } from '../../utils/hooks';
import { hentPath } from '../../utils/routing';
import { hentHTMLTekst, hentTekst } from '../../utils/teksthåndtering';
import { ERouteArbeidssøkerskjema, RoutesArbeidssokerskjema } from './routes/routesArbeidssokerskjema';
import { useSkjema } from './SkjemaContext';

const Forside: React.FC<{ visningsnavn: string }> = ({ visningsnavn }) => {
    const intl = useLokalIntlContext();
    const { skjema, settSkjema } = useSkjema();

    const settBekreftelse = (bekreftelse: boolean) => {
        settSkjema({
            ...skjema,
            harBekreftet: bekreftelse,
        });
    };

    const nesteSide = hentPath(RoutesArbeidssokerskjema, ERouteArbeidssøkerskjema.Spørsmål) || '';

    const skalViseSpråkValg = true;

    useSpråkValg(skalViseSpråkValg);

    return (
        <div className={'forside'}>
            <div className={'forside__innhold'}>
                <Box padding="space-16" className={'forside__panel'}>
                    <VeilederBoks navn={visningsnavn} />

                    <Heading level="1" size="xlarge">
                        {hentTekst('skjema.sidetittel', intl)}
                    </Heading>

                    <VStack gap={'space-40'}>
                        <VStack gap={'space-12'}>
                            <BodyShort>{hentTekst('forside.arbeidssøker.info', intl)}</BodyShort>
                            <BodyShort>{hentTekst('forside.arbeidssøker.krav', intl)}</BodyShort>
                            {hentHTMLTekst('forside.arbeidssøker.lerMer', intl)}
                        </VStack>

                        <VStack gap={'space-12'}>
                            <Heading level="2" size="small">
                                {hentTekst('forside.arbeidssøker.overskrift.riktigeOpplysninger', intl)}
                            </Heading>
                            <BodyShort>{hentTekst('forside.arbeidssøker.riktigeOpplysninger', intl)}</BodyShort>
                            <BodyShort>{hentTekst('forside.arbeidssøker.meldeEndringer', intl)}</BodyShort>
                            {hentHTMLTekst('forside.arbeidssøker.personopplysningeneDineLenke', intl)}
                        </VStack>

                        <DisclaimerBoks
                            navn={visningsnavn}
                            tekst={'forside.overgangsstønad.disclaimerTekst'}
                            harBekreftet={skjema.harBekreftet}
                            settBekreftelse={settBekreftelse}
                        />

                        {skjema.harBekreftet && <KnappLocaleTekstOgNavigate nesteSide={nesteSide} />}
                    </VStack>
                </Box>
            </div>
        </div>
    );
};

export default Forside;
