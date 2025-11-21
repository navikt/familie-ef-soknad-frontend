import React, { FC } from 'react';
import { IStatus } from '../../../arbeidssøkerskjema/innsending/typer';
import { SøknadOvergangsstønad } from '../../models/søknad';
import { parseISO } from 'date-fns';
import { useOvergangsstønadSøknad } from '../../OvergangsstønadContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { hentForrigeRoute, hentNesteRoute, hentPath } from '../../../../utils/routing';
import { ERouteOvergangsstønad, RoutesOvergangsstonad } from '../../routing/routesOvergangsstonad';
import { StyledKnapper } from '../../../../components/knapper/StyledKnapper';
import {
  mapBarnTilEntenIdentEllerFødselsdato,
  mapBarnUtenBarnepass,
  sendInnOvergangstønadSøknad,
} from '../../../../innsending/api';
import { unikeDokumentasjonsbehov } from '../../../../utils/søknad';
import { useSpråkContext } from '../../../../context/SpråkContext';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { oppdaterBarnLabels } from '../../../../utils/barn';
import { Alert, BodyShort, Button, HStack } from '@navikt/ds-react';
import { validerSøkerBosattINorgeSisteFemÅr } from '../../../../helpers/steg/omdeg';
import { hentTekst } from '../../../../utils/teksthåndtering';

interface Innsending {
  status: string;
  melding: string;
  venter: boolean;
}

export const SendSøknadKnapper: FC = () => {
  const { søknad, settSøknad } = useOvergangsstønadSøknad();
  const location = useLocation();
  const [locale] = useSpråkContext();
  const navigate = useNavigate();
  const nesteRoute = hentNesteRoute(RoutesOvergangsstonad, location.pathname);
  const forrigeRoute = hentForrigeRoute(RoutesOvergangsstonad, location.pathname);
  const intl = useLokalIntlContext();

  const [innsendingState, settinnsendingState] = React.useState<Innsending>({
    status: IStatus.KLAR_TIL_INNSENDING,
    melding: `Søknad kan sendes`,
    venter: false,
  });

  const sendInnSøknad = async (søknadMedFiltrerteBarn: SøknadOvergangsstønad) => {
    try {
      const kvittering = await sendInnOvergangstønadSøknad(søknadMedFiltrerteBarn);

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
        // melding: `Noe gikk galt: ${e}`,
        melding: `Noe gikk galt. Dersom feilen vedvarer kan du prøve å starte søknaden helt på nytt, uten å gjenbruke informasjon fra tidligere søknader.`,
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
    const søknadKlarForSending: SøknadOvergangsstønad = {
      ...søknad,
      person: { ...søknad.person, barn: barnMedOppdaterteLabels },
      dokumentasjonsbehov: dokumentasjonsbehov,
      locale: locale,
    };

    settinnsendingState({ ...innsendingState, venter: true });
    sendInnSøknad(søknadKlarForSending);
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
        <StyledKnapper>
          <Button
            className={'tilbake'}
            variant="secondary"
            onClick={() => navigate(forrigeRoute.path)}
          >
            {hentTekst('knapp.tilbake', intl)}
          </Button>

          {validerSøkerBosattINorgeSisteFemÅr(søknad) && (
            <Button
              variant="primary"
              onClick={() => !innsendingState.venter && sendSøknad(søknad)}
              className={'neste'}
              loading={innsendingState.venter}
            >
              {hentTekst('knapp.sendSøknad', intl)}
            </Button>
          )}
          <Button
            className={'avbryt'}
            variant="tertiary"
            onClick={() => navigate(RoutesOvergangsstonad[0].path)}
          >
            {hentTekst('knapp.avbryt', intl)}
          </Button>
        </StyledKnapper>
      </HStack>
    </>
  );
};
