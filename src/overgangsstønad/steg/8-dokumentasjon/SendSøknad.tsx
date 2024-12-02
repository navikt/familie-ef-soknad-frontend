import React, { FC } from 'react';
import LocaleTekst from '../../../language/LocaleTekst';
import { IStatus } from '../../../arbeidssøkerskjema/innsending/typer';
import { ISøknad } from '../../../models/søknad/søknad';
import { parseISO } from 'date-fns';
import { useSøknad } from '../../../context/SøknadContext';
import { useLocation } from 'react-router';
import KomponentGruppe from '../../../components/gruppe/KomponentGruppe';
import { hentPath } from '../../../utils/routing';
import { Link, useNavigate } from 'react-router-dom';
import {
  RoutesOvergangsstonad,
  ERouteOvergangsstønad,
} from '../../routing/routesOvergangsstonad';
import SeksjonGruppe from '../../../components/gruppe/SeksjonGruppe';
import { StyledKnapper } from '../../../components/knapper/StyledKnapper';
import {
  mapBarnTilEntenIdentEllerFødselsdato,
  mapBarnUtenBarnepass,
  sendInnSøknad,
  sendInnSøknadFamiliePdf,
} from '../../../innsending/api';
import { hentForrigeRoute, hentNesteRoute } from '../../../utils/routing';
import { unikeDokumentasjonsbehov } from '../../../utils/søknad';
import { useSpråkContext } from '../../../context/SpråkContext';
import { useLokalIntlContext } from '../../../context/LokalIntlContext';
import { oppdaterBarnLabels } from '../../../utils/barn';
import {
  logDokumetasjonsbehov,
  logInnsendingFeilet,
} from '../../../utils/amplitude';
import { ESkjemanavn, skjemanavnIdMapping } from '../../../utils/skjemanavn';
import { Alert, BodyShort, Button } from '@navikt/ds-react';
import { validerSøkerBosattINorgeSisteFemÅr } from '../../../helpers/steg/omdeg';
import { useToggles } from '../../../context/TogglesContext';
import { ToggleName } from '../../../models/søknad/toggles';

interface Innsending {
  status: string;
  melding: string;
  venter: boolean;
}

const SendSøknadKnapper: FC = () => {
  const { toggles } = useToggles();
  const { søknad, settSøknad } = useSøknad();
  const location = useLocation();
  const [locale] = useSpråkContext();
  const navigate = useNavigate();
  const nesteRoute = hentNesteRoute(RoutesOvergangsstonad, location.pathname);
  const intl = useLokalIntlContext();
  const forrigeRoute = hentForrigeRoute(
    RoutesOvergangsstonad,
    location.pathname
  );

  const [innsendingState, settinnsendingState] = React.useState<Innsending>({
    status: IStatus.KLAR_TIL_INNSENDING,
    melding: `Søknad kan sendes`,
    venter: false,
  });

  const skalViseNyKnapp = toggles[ToggleName.visNyInnsendingsknapp];

  const sendSøknad = (søknad: ISøknad, brukFamiliePdf?: boolean) => {
    const barnMedEntenIdentEllerFødselsdato = mapBarnUtenBarnepass(
      mapBarnTilEntenIdentEllerFødselsdato(søknad.person.barn)
    );
    const barnMedOppdaterteLabels = oppdaterBarnLabels(
      barnMedEntenIdentEllerFødselsdato,
      intl
    );

    const dokumentasjonsbehov = søknad.dokumentasjonsbehov.filter(
      unikeDokumentasjonsbehov
    );
    logDokumetasjonsbehov(dokumentasjonsbehov, ESkjemanavn.Overgangsstønad);
    const søknadKlarForSending: ISøknad = {
      ...søknad,
      person: { ...søknad.person, barn: barnMedOppdaterteLabels },
      dokumentasjonsbehov: dokumentasjonsbehov,
      locale: locale,
    };

    const skjemaId = skjemanavnIdMapping[ESkjemanavn.Overgangsstønad];

    settinnsendingState({ ...innsendingState, venter: true });

    (brukFamiliePdf === true ? sendInnSøknadFamiliePdf : sendInnSøknad)(
      søknadKlarForSending
    )
      .then((kvittering) => {
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
      })
      .catch((e) => {
        settinnsendingState({
          ...innsendingState,
          status: IStatus.FEILET,
          melding: `Noe gikk galt: ${e}`,
          venter: false,
        });

        logInnsendingFeilet(ESkjemanavn.Overgangsstønad, skjemaId, e);
      });
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
                pathname: hentPath(
                  RoutesOvergangsstonad,
                  ERouteOvergangsstønad.OmDeg
                ),
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
        {skalViseNyKnapp && (
          <div style={{ marginLeft: '20px' }}>
            <Button
              className={'neste'}
              variant="secondary"
              loading={innsendingState.venter}
              onClick={() =>
                !innsendingState.venter && sendSøknad(søknad, skalViseNyKnapp)
              }
            >
              <LocaleTekst tekst={'Familie pdf - Send søknad '} />
            </Button>
          </div>
        )}
      </SeksjonGruppe>
    </>
  );
};

export default SendSøknadKnapper;
