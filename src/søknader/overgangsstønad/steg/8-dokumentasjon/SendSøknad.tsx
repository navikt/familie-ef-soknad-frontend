import React, { FC } from 'react';
import LocaleTekst from '../../../../language/LocaleTekst';
import { IStatus } from '../../../arbeidssøkerskjema/innsending/typer';
import { SøknadOvergangsstønad } from '../../models/søknad';
import { parseISO } from 'date-fns';
import { useOvergangsstønadSøknad } from '../../OvergangsstønadContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import { hentForrigeRoute, hentNesteRoute, hentPath } from '../../../../utils/routing';
import { ERouteOvergangsstønad, RoutesOvergangsstonad } from '../../routing/routesOvergangsstonad';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
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
import { logDokumetasjonsbehov, logInnsendingFeilet } from '../../../../utils/amplitude';
import { ESkjemanavn, skjemanavnIdMapping } from '../../../../utils/skjemanavn';
import { Alert, BodyShort, Button } from '@navikt/ds-react';
import { validerSøkerBosattINorgeSisteFemÅr } from '../../../../helpers/steg/omdeg';

interface Innsending {
  status: string;
  melding: string;
  venter: boolean;
}

const SendSøknadKnapper: FC = () => {
  const { søknad, settSøknad } = useOvergangsstønadSøknad();
  const location = useLocation();
  const [locale] = useSpråkContext();
  const navigate = useNavigate();
  const nesteRoute = hentNesteRoute(RoutesOvergangsstonad, location.pathname);
  const skjemaId = skjemanavnIdMapping[ESkjemanavn.Overgangsstønad];
  const intl = useLokalIntlContext();
  const forrigeRoute = hentForrigeRoute(RoutesOvergangsstonad, location.pathname);

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
      settinnsendingState({
        ...innsendingState,
        status: IStatus.FEILET,
        melding: `Noe gikk galt: ${e}`,
        venter: false,
      });

      logInnsendingFeilet(ESkjemanavn.Overgangsstønad, skjemaId, e);
    }
  };

  const sendSøknad = (søknad: SøknadOvergangsstønad) => {
    const barnMedEntenIdentEllerFødselsdato = mapBarnUtenBarnepass(
      mapBarnTilEntenIdentEllerFødselsdato(søknad.person.barn)
    );
    const barnMedOppdaterteLabels = oppdaterBarnLabels(barnMedEntenIdentEllerFødselsdato, intl);

    const dokumentasjonsbehov = søknad.dokumentasjonsbehov.filter(unikeDokumentasjonsbehov);
    logDokumetasjonsbehov(dokumentasjonsbehov, ESkjemanavn.Overgangsstønad);
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
        <KomponentGruppe>
          <Alert size="small" variant="warning" inline>
            <BodyShort>{innsendingState.melding}</BodyShort>
          </Alert>
        </KomponentGruppe>
      )}
      {!validerSøkerBosattINorgeSisteFemÅr(søknad) && (
        <KomponentGruppe>
          <Alert size="small" variant="warning" inline>
            <LocaleTekst tekst="dokumentasjon.alert.gåTilbake" />{' '}
            <Link
              to={{
                pathname: hentPath(RoutesOvergangsstonad, ERouteOvergangsstønad.OmDeg),
              }}
              state={{ kommerFraOppsummering: true }}
            >
              <LocaleTekst tekst="dokumentasjon.alert.link.fylleInn" />
            </Link>
            <LocaleTekst tekst="dokumentasjon.alert.manglende" />
          </Alert>
        </KomponentGruppe>
      )}
      <SeksjonGruppe className={'sentrert'}>
        <StyledKnapper>
          <Button
            className={'tilbake'}
            variant="secondary"
            onClick={() => navigate(forrigeRoute.path)}
          >
            <LocaleTekst tekst={'knapp.tilbake'} />
          </Button>

          {validerSøkerBosattINorgeSisteFemÅr(søknad) && (
            <Button
              variant="primary"
              onClick={() => !innsendingState.venter && sendSøknad(søknad)}
              className={'neste'}
              loading={innsendingState.venter}
            >
              <LocaleTekst tekst={'knapp.sendSøknad'} />
            </Button>
          )}
          <Button
            className={'avbryt'}
            variant="tertiary"
            onClick={() => navigate(RoutesOvergangsstonad[0].path)}
          >
            <LocaleTekst tekst={'knapp.avbryt'} />
          </Button>
        </StyledKnapper>
      </SeksjonGruppe>
    </>
  );
};

export default SendSøknadKnapper;
