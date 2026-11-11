import { Alert, BodyShort, Button, HGrid, HStack, VStack } from '@navikt/ds-react';
import { parseISO } from 'date-fns';
import React, { type FC } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { useSpråkContext } from '../../../../context/SpråkContext';
import { validerSøkerBosattINorgeSisteFemÅr } from '../../../../helpers/steg/omdeg';
import {
    mapBarnTilEntenIdentEllerFødselsdato,
    mapBarnUtenBarnepass,
    sendInnOvergangstønadSøknad,
    sendInnOvergangstønadSøknadRegelendring2026,
} from '../../../../innsending/api';
import { oppdaterBarnLabels } from '../../../../utils/barn';
import { hentForrigeRoute, hentNesteRoute, hentPath } from '../../../../utils/routing';
import { unikeDokumentasjonsbehov } from '../../../../utils/søknad';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { IStatus } from '../../../arbeidssøkerskjema/innsending/typer';
import type { SøknadOvergangsstønad } from '../../models/søknad';
import { tilSøknadRegelendring2026 } from '../../models/søknad-regelendring-2026';
import { useOvergangsstønadSøknad } from '../../OvergangsstønadContext';
import {
    ERouteOvergangsstønad,
    hentRoutesOvergangsstonad,
    RoutesOvergangsstonad,
} from '../../routing/routesOvergangsstonad';

interface Innsending {
    status: string;
    melding: string;
    venter: boolean;
}

export const SendSøknadKnapper: FC = () => {
    const { søknad, settSøknad, skalBrukeRegelendringer2026 } = useOvergangsstønadSøknad();
    const location = useLocation();
    const [locale] = useSpråkContext();
    const navigate = useNavigate();

    const routes = hentRoutesOvergangsstonad(skalBrukeRegelendringer2026);
    const nesteRoute = hentNesteRoute(routes, location.pathname);
    const forrigeRoute = hentForrigeRoute(routes, location.pathname);
    const intl = useLokalIntlContext();

    const [innsendingState, settinnsendingState] = React.useState<Innsending>({
        status: IStatus.KLAR_TIL_INNSENDING,
        melding: `Søknad kan sendes`,
        venter: false,
    });

    const sendInnSøknad = async (søknadPayload: object) => {
        try {
            const apiKall = skalBrukeRegelendringer2026
                ? sendInnOvergangstønadSøknadRegelendring2026
                : sendInnOvergangstønadSøknad;
            const kvittering = await apiKall(søknadPayload);

            settinnsendingState({
                ...innsendingState,
                status: IStatus.SUKSESS,
                melding: `Vi har kontakt: ${kvittering.text}`,
                venter: false,
            });
            settSøknad({
                ...søknad,
                innsendingsdato: parseISO(kvittering.mottattDato),
            });
            navigate(nesteRoute.path);
        } catch (e: any) {
            console.log(e);
            settinnsendingState({
                ...innsendingState,
                status: IStatus.FEILET,
                melding: `Noe gikk galt: ${e}`,
                venter: false,
            });
        }
    };

    const sendSøknad = (søknad: SøknadOvergangsstønad) => {
        const barnMedEntenIdentEllerFødselsdato = mapBarnUtenBarnepass(
            mapBarnTilEntenIdentEllerFødselsdato(søknad.person.barn)
        );
        const barnMedOppdaterteLabels = oppdaterBarnLabels(barnMedEntenIdentEllerFødselsdato, intl);

        const dokumentasjonsbehov = søknad.dokumentasjonsbehov.filter(unikeDokumentasjonsbehov);
        const søknadMedFellesTransformasjon: SøknadOvergangsstønad = {
            ...søknad,
            person: { ...søknad.person, barn: barnMedOppdaterteLabels },
            dokumentasjonsbehov: dokumentasjonsbehov,
            locale: locale,
        };

        settinnsendingState({ ...innsendingState, venter: true });

        if (skalBrukeRegelendringer2026) {
            sendInnSøknad(tilSøknadRegelendring2026(søknadMedFellesTransformasjon));
        } else {
            sendInnSøknad(søknadMedFellesTransformasjon);
        }
    };

    return (
        <>
            {innsendingState.status === IStatus.FEILET && (
                <Alert size="small" variant="warning" inline>
                    <BodyShort>{innsendingState.melding}</BodyShort>
                </Alert>
            )}
            {!validerSøkerBosattINorgeSisteFemÅr(søknad) && (
                <>
                    <Alert size="small" variant="warning" inline>
                        {hentTekst('dokumentasjon.alert.gåTilbake', intl)}{' '}
                        <Link
                            to={{
                                pathname: hentPath(RoutesOvergangsstonad, ERouteOvergangsstønad.OmDeg),
                            }}
                            state={{ kommerFraOppsummering: true }}
                        >
                            {hentTekst('dokumentasjon.alert.link.fylleInn', intl)}
                        </Link>
                        {hentTekst('dokumentasjon.alert.manglende', intl)}
                    </Alert>
                </>
            )}
            <HStack justify={'center'}>
                <VStack gap={'space-16'} style={{ maxWidth: '500px' }}>
                    <HGrid columns={{ xs: 1, sm: 2 }} gap={'space-16'}>
                        <Button variant="secondary" onClick={() => navigate(forrigeRoute.path)}>
                            {hentTekst('knapp.tilbake', intl)}
                        </Button>

                        {validerSøkerBosattINorgeSisteFemÅr(søknad) && (
                            <Button
                                variant="primary"
                                onClick={() => !innsendingState.venter && sendSøknad(søknad)}
                                loading={innsendingState.venter}
                            >
                                {hentTekst('knapp.sendSøknad', intl)}
                            </Button>
                        )}
                    </HGrid>
                    <Button variant="tertiary" onClick={() => navigate(RoutesOvergangsstonad[0].path)}>
                        {hentTekst('knapp.avbryt', intl)}
                    </Button>
                </VStack>
            </HStack>
        </>
    );
};
