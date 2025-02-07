import React, { FC } from 'react';
import { useLocation } from 'react-router-dom';
import {
  erStegFerdigUtfylt,
  erÅrsakEnsligBesvart,
  søkerBorPåRegistrertAdresseEllerHarMeldtAdresseendring,
} from '../../../helpers/steg/omdeg';
import { useSkolepengerSøknad } from '../../SkolepengerContext';
import { IMedlemskap } from '../../../models/steg/omDeg/medlemskap';
import Medlemskap from '../../../søknad/steg/1-omdeg/medlemskap/Medlemskap';
import Personopplysninger from '../../../søknad/steg/1-omdeg/personopplysninger/Personopplysninger';
import { ISpørsmålBooleanFelt } from '../../../models/søknad/søknadsfelter';
import Sivilstatus from '../../../søknad/steg/1-omdeg/sivilstatus/Sivilstatus';
import { ISivilstatus } from '../../../models/steg/omDeg/sivilstatus';
import Side, { ESide } from '../../../components/side/Side';
import { RoutesSkolepenger } from '../../routing/routes';
import { hentPathSkolepengerOppsummering } from '../../utils';
import { Stønadstype } from '../../../models/søknad/stønadstyper';
import Show from '../../../utils/showIf';
import { ISøknad } from '../../models/søknad';
import { kommerFraOppsummeringen } from '../../../utils/locationState';
import { useLokalIntlContext } from '../../../context/LokalIntlContext';

const OmDeg: FC = () => {
  const location = useLocation();
  const intl = useLokalIntlContext();
  const kommerFraOppsummering = kommerFraOppsummeringen(location.state);
  const skalViseKnapper = !kommerFraOppsummering
    ? ESide.visTilbakeNesteAvbrytKnapp
    : ESide.visTilbakeTilOppsummeringKnapp;
  const {
    søknad,
    mellomlagreSkolepenger,
    settSøknad,
    settDokumentasjonsbehov,
  } = useSkolepengerSøknad();

  const { harSøktSeparasjon, datoSøktSeparasjon, datoFlyttetFraHverandre } =
    søknad.sivilstatus;

  const { søker } = søknad.person;

  const settMedlemskap = (medlemskap: IMedlemskap) => {
    settSøknad((prevSoknad: ISøknad) => {
      return {
        ...prevSoknad,
        medlemskap: medlemskap,
      };
    });
  };

  const settSøkerBorPåRegistrertAdresse = (
    søkerBorPåRegistrertAdresse: ISpørsmålBooleanFelt
  ) => {
    settSøknad((prevSoknad: ISøknad) => {
      return {
        ...prevSoknad,
        adresseopplysninger: undefined,
        søkerBorPåRegistrertAdresse: søkerBorPåRegistrertAdresse,
        sivilstatus: {},
        medlemskap: {},
      };
    });
  };
  const settHarMeldtAdresseendring = (
    harMeldtAdresseendring: ISpørsmålBooleanFelt
  ) => {
    settSøknad((prevSøknad: ISøknad) => ({
      ...prevSøknad,
      adresseopplysninger: {
        ...prevSøknad.adresseopplysninger,
        harMeldtAdresseendring: harMeldtAdresseendring,
      },
    }));
  };

  const settSivilstatus = (sivilstatus: ISivilstatus) => {
    settSøknad((prevSoknad: ISøknad) => {
      return {
        ...prevSoknad,
        sivilstatus: sivilstatus,
      };
    });
  };

  const erSøkerBorPåRegistrertAdresseEllerHarMeldtAdresseendring =
    søkerBorPåRegistrertAdresseEllerHarMeldtAdresseendring(søknad);

  const erAlleSpørsmålBesvart = erStegFerdigUtfylt(
    søknad.sivilstatus,
    søker.sivilstand,
    søknad.medlemskap,
    erSøkerBorPåRegistrertAdresseEllerHarMeldtAdresseendring
  );

  const harFyltUtSeparasjonSpørsmålet =
    harSøktSeparasjon !== undefined
      ? harSøktSeparasjon.verdi
        ? datoSøktSeparasjon && datoFlyttetFraHverandre
        : true
      : false;

  return (
    <Side
      stønadstype={Stønadstype.skolepenger}
      stegtittel={intl.formatMessage({ id: 'stegtittel.omDeg' })}
      erSpørsmålBesvart={erAlleSpørsmålBesvart}
      skalViseKnapper={skalViseKnapper}
      routesStønad={RoutesSkolepenger}
      mellomlagreStønad={mellomlagreSkolepenger}
      tilbakeTilOppsummeringPath={hentPathSkolepengerOppsummering}
    >
      <Personopplysninger
        søker={søker}
        settDokumentasjonsbehov={settDokumentasjonsbehov}
        søkerBorPåRegistrertAdresse={søknad.søkerBorPåRegistrertAdresse}
        settSøkerBorPåRegistrertAdresse={settSøkerBorPåRegistrertAdresse}
        harMeldtAdresseendring={
          søknad.adresseopplysninger?.harMeldtAdresseendring
        }
        settHarMeldtAdresseendring={settHarMeldtAdresseendring}
        stønadstype={Stønadstype.skolepenger}
      />

      <Show if={erSøkerBorPåRegistrertAdresseEllerHarMeldtAdresseendring}>
        <Sivilstatus
          sivilstatus={søknad.sivilstatus}
          settSivilstatus={settSivilstatus}
          settDokumentasjonsbehov={settDokumentasjonsbehov}
          settMedlemskap={settMedlemskap}
        />

        <Show
          if={
            harFyltUtSeparasjonSpørsmålet ||
            erÅrsakEnsligBesvart(søknad.sivilstatus)
          }
        >
          <Medlemskap
            medlemskap={søknad.medlemskap}
            settMedlemskap={settMedlemskap}
          />
        </Show>
      </Show>
    </Side>
  );
};

export default OmDeg;
