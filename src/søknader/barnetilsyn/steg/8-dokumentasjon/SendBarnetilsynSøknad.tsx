import React, { FC } from 'react';
import LocaleTekst from '../../../../language/LocaleTekst';
import { IStatus } from '../../../arbeidssøkerskjema/innsending/typer';
import { parseISO } from 'date-fns';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
import { StyledKnapper } from '../../../../components/knapper/StyledKnapper';
import { RoutesBarnetilsyn } from '../../routing/routesBarnetilsyn';
import {
  mapBarnTilEntenIdentEllerFødselsdato,
  sendInnBarnetilsynSøknad,
} from '../../../../innsending/api';
import { useBarnetilsynSøknad } from '../../BarnetilsynContext';
import { SøknadBarnetilsyn } from '../../models/søknad';
import { IBarn } from '../../../../models/steg/barn';
import { hentForrigeRoute, hentNesteRoute, hentPath } from '../../../../utils/routing';
import { unikeDokumentasjonsbehov } from '../../../../utils/søknad';

import { logDokumetasjonsbehov, logInnsendingFeilet } from '../../../../utils/amplitude';
import { ESkjemanavn, skjemanavnIdMapping } from '../../../../utils/skjemanavn';
import { ERouteSkolepenger, RoutesSkolepenger } from '../../../skolepenger/routing/routes';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { oppdaterBarnLabels } from '../../../../utils/barn';
import { Alert, BodyShort, Button } from '@navikt/ds-react';
import { useSpråkContext } from '../../../../context/SpråkContext';

interface Innsending {
  status: string;
  melding: string;
  venter: boolean;
}

const validerSøkerBosattINorgeSisteFemÅr = (søknad: SøknadBarnetilsyn) => {
  return søknad.medlemskap.søkerBosattINorgeSisteTreÅr;
};

const SendSøknadKnapper: FC = () => {
  const { søknad, settSøknad } = useBarnetilsynSøknad();
  const location = useLocation();
  const navigate = useNavigate();
  const nesteRoute = hentNesteRoute(RoutesBarnetilsyn, location.pathname);
  const forrigeRoute = hentForrigeRoute(RoutesBarnetilsyn, location.pathname);
  const skjemaId = skjemanavnIdMapping[ESkjemanavn.Barnetilsyn];
  const intl = useLokalIntlContext();
  const [locale] = useSpråkContext();

  const [innsendingState, settinnsendingState] = React.useState<Innsending>({
    status: IStatus.KLAR_TIL_INNSENDING,
    melding: `Søknad kan sendes`,
    venter: false,
  });

  const filtrerBarnSomSkalHaBarnepass = (barneliste: IBarn[]) => {
    return barneliste.filter((barn) => barn.skalHaBarnepass?.verdi === true);
  };

  const sendInnSøknad = async (søknadMedFiltrerteBarn: SøknadBarnetilsyn) => {
    try {
      const kvittering = await sendInnBarnetilsynSøknad(søknadMedFiltrerteBarn);

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

      logInnsendingFeilet(ESkjemanavn.Barnetilsyn, skjemaId, e);
    }
  };

  const sendSøknad = (søknad: SøknadBarnetilsyn) => {
    const barnMedEntenIdentEllerFødselsdato = filtrerBarnSomSkalHaBarnepass(
      mapBarnTilEntenIdentEllerFødselsdato(søknad.person.barn)
    );
    const barnMedOppdaterteLabels = oppdaterBarnLabels(barnMedEntenIdentEllerFødselsdato, intl);

    const dokumentasjonsbehov = søknad.dokumentasjonsbehov.filter(unikeDokumentasjonsbehov);
    logDokumetasjonsbehov(dokumentasjonsbehov, ESkjemanavn.Barnetilsyn);
    const søknadMedFiltrerteBarn: SøknadBarnetilsyn = {
      ...søknad,
      person: { ...søknad.person, barn: barnMedOppdaterteLabels },
      dokumentasjonsbehov: dokumentasjonsbehov,
      locale: locale,
    };
    settinnsendingState({ ...innsendingState, venter: true });
    sendInnSøknad(søknadMedFiltrerteBarn);
  };

  return (
    <>
      {innsendingState.status === IStatus.FEILET && (
        <KomponentGruppe>
          <Alert size="small" variant={'warning'} inline>
            <BodyShort>{innsendingState.melding}</BodyShort>
          </Alert>
        </KomponentGruppe>
      )}
      {!validerSøkerBosattINorgeSisteFemÅr(søknad) && (
        <KomponentGruppe>
          <Alert size="small" variant={'warning'} inline>
            <LocaleTekst tekst="dokumentasjon.alert.gåTilbake" />{' '}
            <Link
              to={{
                pathname: hentPath(RoutesSkolepenger, ERouteSkolepenger.OmDeg),
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
            variant={'secondary'}
            onClick={() => navigate(forrigeRoute.path)}
          >
            <LocaleTekst tekst={'knapp.tilbake'} />
          </Button>

          {validerSøkerBosattINorgeSisteFemÅr(søknad) && (
            <Button
              variant={'primary'}
              onClick={() => !innsendingState.venter && sendSøknad(søknad)}
              className={'neste'}
              loading={innsendingState.venter}
            >
              <LocaleTekst tekst={'knapp.sendSøknad'} />
            </Button>
          )}
          <Button
            className={'avbryt'}
            variant={'tertiary'}
            onClick={() => navigate(RoutesBarnetilsyn[0].path)}
          >
            <LocaleTekst tekst={'knapp.avbryt'} />
          </Button>
        </StyledKnapper>
      </SeksjonGruppe>
    </>
  );
};

export default SendSøknadKnapper;
