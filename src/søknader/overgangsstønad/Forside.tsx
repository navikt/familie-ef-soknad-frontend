import { Box, Heading } from '@navikt/ds-react';
import type React from 'react';
import { AlertUnderAtten } from '../../components/forside/AlertUnderAtten';
import FortsettSøknad from '../../components/forside/FortsettSøknad';
import { VeilederBoks } from '../../components/forside/VeilederBoks';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { usePersonContext } from '../../context/PersonContext';
import { useSpråkValg } from '../../utils/hooks';
import { ESkjemanavn } from '../../utils/skjemanavn';
import { hentTekst } from '../../utils/teksthåndtering';
import { useOvergangsstønadSøknad } from './OvergangsstønadContext';
import { OvergangsstønadInformasjon } from './OvergangsstønadInformasjon';

const Forside: React.FC = () => {
    const intl = useLokalIntlContext();
    const { person } = usePersonContext();
    const {
        mellomlagretOvergangsstønad,
        aktivModellVersjon,
        brukMellomlagretOvergangsstønad,
        nullstillMellomlagretOvergangsstønad,
        søknad,
        settSøknad,
    } = useOvergangsstønadSøknad();

    const settBekreftelse = (bekreftelse: boolean) => {
        settSøknad({
            ...søknad,
            harBekreftet: bekreftelse,
        });
    };

    const kanBrukeMellomlagretSøknad =
        mellomlagretOvergangsstønad !== undefined &&
        mellomlagretOvergangsstønad.søknad.person.hash === person.hash &&
        mellomlagretOvergangsstønad.modellVersjon === aktivModellVersjon;

    const alder = person.søker.alder;

    const skalViseSpråkValg = !(kanBrukeMellomlagretSøknad && mellomlagretOvergangsstønad);

    useSpråkValg(skalViseSpråkValg);

    return (
        <div className={'forside'}>
            <div className={'forside__innhold'}>
                <Box padding="space-16" className={'forside__panel'}>
                    <VeilederBoks />

                    {alder < 18 && <AlertUnderAtten />}

                    <Heading level="1" size="xlarge">
                        {hentTekst('banner.tittel.overgangsstønad', intl)}
                    </Heading>

                    {kanBrukeMellomlagretSøknad && mellomlagretOvergangsstønad ? (
                        <FortsettSøknad
                            intl={intl}
                            gjeldendeSteg={mellomlagretOvergangsstønad.gjeldendeSteg}
                            brukMellomlagretSøknad={brukMellomlagretOvergangsstønad}
                            nullstillMellomlagretSøknad={nullstillMellomlagretOvergangsstønad}
                            skjemanavn={ESkjemanavn.Overgangsstønad}
                        />
                    ) : (
                        alder > 17 && (
                            <OvergangsstønadInformasjon
                                person={person}
                                harBekreftet={søknad.harBekreftet}
                                settBekreftelse={settBekreftelse}
                            />
                        )
                    )}
                </Box>
            </div>
        </div>
    );
};

export default Forside;
