import React, { FC } from 'react';
import KnappBase from 'nav-frontend-knapper';
import LocaleTekst from '../../../language/LocaleTekst';
import { IStatus } from '../../../arbeidssøkerskjema/innsending/typer';
import { ISøknad, LocationStateSøknad } from '../../../models/søknad/søknad';
import { parseISO } from 'date-fns';
import { useSøknad } from '../../../context/SøknadContext';
import { useHistory, useLocation } from 'react-router';
import KomponentGruppe from '../../../components/gruppe/KomponentGruppe';
import AlertStripe from 'nav-frontend-alertstriper';
import { Normaltekst } from 'nav-frontend-typografi';
import { hentPath } from '../../../utils/routing';
import { Link } from "react-router-dom";
import { RoutesOvergangsstonad, ERouteOvergangsstønad } from '../../routing/routesOvergangsstonad';
import SeksjonGruppe from '../../../components/gruppe/SeksjonGruppe';
import { StyledKnapper } from '../../../arbeidssøkerskjema/komponenter/StyledKnapper';
import {
  mapBarnTilEntenIdentEllerFødselsdato,
  mapBarnUtenBarnepass,
  sendInnSøknad,
} from '../../../innsending/api';
import { hentForrigeRoute, hentNesteRoute } from '../../../utils/routing';
import { unikeDokumentasjonsbehov } from '../../../utils/søknad';
import { useSpråkContext } from '../../../context/SpråkContext';
import { useIntl} from 'react-intl';
import { IPerson } from '../../../models/søknad/person';
import { IBarn } from '../../../models/steg/barn';
import { barnetsNavnEllerBarnet } from "../../../utils/barn";

interface Innsending {
  status: string;
  melding: string;
  venter: boolean;
}

const validerSøkerBosattINorgeSisteTreÅr = (søknad: ISøknad) => {
  return søknad.medlemskap.søkerBosattINorgeSisteTreÅr;
}

const SendSøknadKnapper: FC = () => {
  const { søknad, settSøknad } = useSøknad();
  const location = useLocation<LocationStateSøknad>();
  const [locale] = useSpråkContext();
  const history = useHistory();
  const nesteRoute = hentNesteRoute(RoutesOvergangsstonad, location.pathname);
  const intl = useIntl();
  const forrigeRoute = hentForrigeRoute(
    RoutesOvergangsstonad,
    location.pathname
  );

  const [innsendingState, settinnsendingState] = React.useState<Innsending>({
    status: IStatus.KLAR_TIL_INNSENDING,
    melding: `Søknad kan sendes`,
    venter: false,
  });

  const settOppdaterteBarnLabelsPåPerson = (person: IPerson) => {
    const nyeBarn = person.barn.map((barn: any) => {
      const navnEllerBarn = barnetsNavnEllerBarnet(barn, intl);

      const nyttBarn = {...barn};

      Object.keys(nyttBarn.forelder).forEach(key => {
        if (!nyttBarn.forelder[key]?.label) {
          return;
        }
  
        let labelMedNavnEllerBarnet = nyttBarn.forelder[key].label;
  
        labelMedNavnEllerBarnet = labelMedNavnEllerBarnet?.replace("[0]", navnEllerBarn);
  
        nyttBarn.forelder[key].label = labelMedNavnEllerBarnet;
      })
  
      return nyttBarn;
    });
  
    return {...person, barn: [...nyeBarn]}
  }

  const sendSøknad = (søknad: ISøknad) => {
    const barnMedEntenIdentEllerFødselsdato = mapBarnUtenBarnepass(
      mapBarnTilEntenIdentEllerFødselsdato(søknad.person.barn)
    );
    const dokumentasjonsbehov = søknad.dokumentasjonsbehov.filter(
      unikeDokumentasjonsbehov
    );

    const søknadKlarForSending: ISøknad = {
      ...søknad,
      person: settOppdaterteBarnLabelsPåPerson(søknad.person),
      dokumentasjonsbehov: dokumentasjonsbehov,
      locale: locale,
    };

    settinnsendingState({ ...innsendingState, venter: true });
    sendInnSøknad(søknadKlarForSending)
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
        history.push(nesteRoute.path);
      })
      .catch((e) =>
        settinnsendingState({
          ...innsendingState,
          status: IStatus.FEILET,
          melding: `Noe gikk galt: ${e}`,
          venter: false,
        })
      );
  };

  return (
    <>
      {innsendingState.status === IStatus.FEILET && (
        <KomponentGruppe>
          <AlertStripe type={'advarsel'} form={'inline'}>
            <Normaltekst>{innsendingState.melding}</Normaltekst>
          </AlertStripe>
        </KomponentGruppe>
      )}
      {!validerSøkerBosattINorgeSisteTreÅr(søknad) && (
      <KomponentGruppe>
        <AlertStripe type={'advarsel'} form={'inline'}>
          <LocaleTekst tekst="dokumentasjon.alert.gåTilbake"/> <Link to={{
      pathname: hentPath(
        RoutesOvergangsstonad,
        ERouteOvergangsstønad.OmDeg
      ),
      state: { kommerFraOppsummering: true },
      }}><LocaleTekst tekst="dokumentasjon.alert.link.fylleInn"/></Link> <LocaleTekst tekst="dokumentasjon.alert.manglende"/>
          </AlertStripe>
      </KomponentGruppe>
      )}
      <SeksjonGruppe className={'sentrert'}>
        <StyledKnapper>
          <KnappBase
            className={'tilbake'}
            type={'standard'}
            onClick={() => history.push(forrigeRoute.path)}
          >
            <LocaleTekst tekst={'knapp.tilbake'} />
          </KnappBase>

          {validerSøkerBosattINorgeSisteTreÅr(søknad) && <KnappBase
            type={'hoved'}
            onClick={() => !innsendingState.venter && sendSøknad(søknad)}
            className={'neste'}
            spinner={innsendingState.venter}
          >
            <LocaleTekst tekst={'knapp.sendSøknad'} />
          </KnappBase>}
          <KnappBase
            className={'avbryt'}
            type={'flat'}
            onClick={() => history.push(RoutesOvergangsstonad[0].path)}
          >
            <LocaleTekst tekst={'knapp.avbryt'} />
          </KnappBase>
        </StyledKnapper>
      </SeksjonGruppe>
    </>
  );
};

export default SendSøknadKnapper;
