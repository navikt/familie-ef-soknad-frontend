import { BodyShort, Box, GuidePanel, VStack } from '@navikt/ds-react';
import React, { type FC } from 'react';
import { KnappLocaleTekstOgNavigate } from '../../../../components/knapper/KnappLocaleTekstOgNavigate';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { hentPath } from '../../../../utils/routing';
import { hentTekst, hentTekstMedEnVariabel } from '../../../../utils/teksthåndtering';
import { useBarnetilsynSøknad } from '../../BarnetilsynContext';
import { ERouteBarnetilsyn, RoutesBarnetilsyn } from '../../routing/routesBarnetilsyn';
import { useBarnetilsynRoutes } from '../../routing/useBarnetilsynRoutes';
import { GjenbrukKnapp } from './GjenbrukKnapp';

const Gjenbruk: FC = () => {
    const intl = useLokalIntlContext();
    const { søknad } = useBarnetilsynSøknad();
    const { gjenbrukAktivert } = useBarnetilsynRoutes();

    if (!gjenbrukAktivert) {
        return null;
    }

    const nesteSide = hentPath(RoutesBarnetilsyn, ERouteBarnetilsyn.OmDeg) || '';
    return (
        <div className={'forside'}>
            <div className={'forside__innhold'}>
                <Box padding="space-16" className={'forside__panel'}>
                    <GuidePanel poster>
                        <VStack gap={'space-16'} style={{ marginBottom: '2rem' }}>
                            <BodyShort>
                                {hentTekstMedEnVariabel('skjema.hei', intl, søknad.person.søker.forkortetNavn)}
                            </BodyShort>

                            <BodyShort>{hentTekst('tidligere.barnetilsyn.søknad.finnes', intl)}</BodyShort>

                            <BodyShort>{hentTekst('gjenbruk.tidligere.barnetilsyn.søknad', intl)}</BodyShort>
                        </VStack>
                        <VStack gap={'space-16'}>
                            <GjenbrukKnapp nesteSide={nesteSide} />
                            <KnappLocaleTekstOgNavigate
                                nesteSide={nesteSide}
                                tekst="knapp.startTom"
                                variant="secondary"
                            />
                        </VStack>
                    </GuidePanel>
                </Box>
            </div>
        </div>
    );
};

export default Gjenbruk;
