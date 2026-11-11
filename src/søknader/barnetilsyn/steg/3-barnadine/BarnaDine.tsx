import { Alert, HStack, Label, ReadMore, VStack } from '@navikt/ds-react';
import type React from 'react';
import { NavigasjonState, Side } from '../../../../components/side/Side';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import type { IBarn } from '../../../../models/steg/barn';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { hentFeltObjekt } from '../../../../utils/søknad';
import { hentHTMLTekst, hentTekst } from '../../../../utils/teksthåndtering';
import { Barnekort } from '../../../felles/steg/3-barnadine/Barnekort';
import { useBarnetilsynSøknad } from '../../BarnetilsynContext';
import { useBarnetilsynRoutes } from '../../routing/useBarnetilsynRoutes';
import { pathOppsummeringBarnetilsyn } from '../../utils';
import BarnMedISøknad from './BarnMedISøknad';

export const BarnaDine: React.FC = () => {
    const intl = useLokalIntlContext();
    const { søknad, mellomlagreBarnetilsyn, oppdaterBarnISøknaden } = useBarnetilsynSøknad();
    const { routes } = useBarnetilsynRoutes();
    const navigasjonState = NavigasjonState.visTilbakeNesteAvbrytKnapp;

    const toggleSkalHaBarnepass = (id: string) => {
        const detteBarnet = søknad.person.barn.find((b: IBarn) => b.id === id);

        if (!detteBarnet) return;

        const skalHaBarnepassVerdi = !detteBarnet.skalHaBarnepass?.verdi;
        const nyttBarn: IBarn = {
            ...detteBarnet,
            skalHaBarnepass: hentFeltObjekt('barnekort.skalHaBarnepass', skalHaBarnepassVerdi, intl),
        };

        if (!skalHaBarnepassVerdi) {
            delete nyttBarn.barnepass;
        }

        oppdaterBarnISøknaden(nyttBarn);
    };

    const harValgtMinstEttBarn = søknad.person.barn.some((b: IBarn) => b.skalHaBarnepass?.verdi);

    const harBarnRegistrertIFolkeregisteret = søknad.person.barn.length > 0;

    return (
        <Side
            stønadstype={Stønadstype.barnetilsyn}
            stegtittel={hentTekst('barnadine.sidetittel', intl)}
            navigasjonState={navigasjonState}
            erSpørsmålBesvart={harValgtMinstEttBarn}
            routesStønad={routes}
            mellomlagreStønad={mellomlagreBarnetilsyn}
            tilbakeTilOppsummeringPath={pathOppsummeringBarnetilsyn}
        >
            <VStack gap={'space-24'}>
                <VStack>
                    <Label size={'medium'}>{hentTekst('barnetilsyn.tekst.hvilke', intl)}</Label>
                    <ReadMore header={hentTekst('barnetilsyn.hjelpetekst-åpne.hvilke', intl)} size={'small'}>
                        {hentHTMLTekst('barnetilsyn.hjelpetekst-innhold.hvilke', intl)}
                    </ReadMore>
                </VStack>

                <Alert variant="info" size="small" inline>
                    {hentTekst('barnadine.infohentet', intl)}
                </Alert>

                {!harBarnRegistrertIFolkeregisteret && (
                    <Alert variant="info" size="small" inline>
                        {hentTekst('barnadine.ingenBarn', intl)}
                    </Alert>
                )}

                <Alert variant="info" size="small" inline>
                    {hentHTMLTekst('barnadine.barnetilsyn.info.brukpdf', intl)}
                </Alert>

                <HStack justify="center" gap="space-16">
                    {søknad.person.barn
                        ?.sort((a: IBarn, b: IBarn) => {
                            if (a.medforelder?.verdi && !b.medforelder?.verdi) {
                                return -1;
                            }
                            if (!a.medforelder?.verdi && b.medforelder?.verdi) {
                                return 1;
                            }
                            return 0;
                        })
                        .map((barn: IBarn, indeks: number) => (
                            <Barnekort
                                key={barn.id}
                                gjeldendeBarn={barn}
                                footer={
                                    <BarnMedISøknad
                                        id={barn.id ? barn.id : ''}
                                        toggleSkalHaBarnepass={toggleSkalHaBarnepass}
                                        skalHaBarnepass={!!barn.skalHaBarnepass?.verdi}
                                        testId={`avhuk-${indeks}`}
                                    />
                                }
                            />
                        ))}
                </HStack>
            </VStack>
        </Side>
    );
};
