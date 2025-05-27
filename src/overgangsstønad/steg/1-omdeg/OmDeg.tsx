import React, { FC } from 'react';
import Medlemskap from '../../../søknad/steg/1-omdeg/medlemskap/Medlemskap';
import Personopplysninger from '../../../søknad/steg/1-omdeg/personopplysninger/Personopplysninger';
import Sivilstatus from '../../../søknad/steg/1-omdeg/sivilstatus/Sivilstatus';
import { useSøknad } from '../../../context/SøknadContext';
import { useLocation } from 'react-router-dom';
import { logSidevisningOvergangsstonad } from '../../../utils/amplitude';
import {
  erStegFerdigUtfylt,
  erÅrsakEnsligBesvart,
  søkerBorPåRegistrertAdresseEllerHarMeldtAdresseendring,
} from '../../../helpers/steg/omdeg';
import { IMedlemskap } from '../../../models/steg/omDeg/medlemskap';
import { ISpørsmålBooleanFelt } from '../../../models/søknad/søknadsfelter';
import { ISivilstatus } from '../../../models/steg/omDeg/sivilstatus';
import Side, { ESide } from '../../../components/side/Side';
import { RoutesOvergangsstonad } from '../../routing/routesOvergangsstonad';
import { hentPathOvergangsstønadOppsummering } from '../../utils';
import { useLokalIntlContext } from '../../../context/LokalIntlContext';
import { Stønadstype } from '../../../models/søknad/stønadstyper';
import { ISøknad } from '../../../models/søknad/søknad';
import Show from '../../../utils/showIf';
import { useMount } from '../../../utils/hooks';
import { kommerFraOppsummeringen } from '../../../utils/locationState';

const OmDeg: FC = () => {
  const intl = useLokalIntlContext();
  const location = useLocation();
  const kommerFraOppsummering = kommerFraOppsummeringen(location.state);
  const skalViseKnapper = !kommerFraOppsummering
    ? ESide.visTilbakeNesteAvbrytKnapp
    : ESide.visTilbakeTilOppsummeringKnapp;
  const {
    søknad,
    mellomlagreOvergangsstønad,
    settSøknad,
    settDokumentasjonsbehov,
  } = useSøknad();

  const { harSøktSeparasjon, datoSøktSeparasjon, datoFlyttetFraHverandre } =
    søknad.sivilstatus;

  const { søker } = søknad.person;

  useMount(() => logSidevisningOvergangsstonad('OmDeg'));

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
        søkerBorPåRegistrertAdresse,
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
        harMeldtAdresseendring,
      },
    }));
  };

  const settSivilstatus = (sivilstatus: ISivilstatus) => {
    settSøknad((prevSoknad: ISøknad) => {
      return {
        ...prevSoknad,
        sivilstatus,
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

  const skalViseMedlemskapDialog =
    harFyltUtSeparasjonSpørsmålet || erÅrsakEnsligBesvart(søknad.sivilstatus);

  return (
    <Side
      stønadstype={Stønadstype.overgangsstønad}
      stegtittel={intl.formatMessage({ id: 'stegtittel.omDeg' })}
      erSpørsmålBesvart={erAlleSpørsmålBesvart}
      skalViseKnapper={skalViseKnapper}
      routesStønad={RoutesOvergangsstonad}
      mellomlagreStønad={mellomlagreOvergangsstønad}
      tilbakeTilOppsummeringPath={hentPathOvergangsstønadOppsummering}
    >
      <Personopplysninger
        søker={søknad.person.søker}
        settDokumentasjonsbehov={settDokumentasjonsbehov}
        søkerBorPåRegistrertAdresse={søknad.søkerBorPåRegistrertAdresse}
        settSøkerBorPåRegistrertAdresse={settSøkerBorPåRegistrertAdresse}
        harMeldtAdresseendring={
          søknad.adresseopplysninger?.harMeldtAdresseendring
        }
        settHarMeldtAdresseendring={settHarMeldtAdresseendring}
        stønadstype={Stønadstype.overgangsstønad}
      />
      <Show if={erSøkerBorPåRegistrertAdresseEllerHarMeldtAdresseendring}>
        <Sivilstatus
          sivilstatus={søknad.sivilstatus}
          settSivilstatus={settSivilstatus}
          settDokumentasjonsbehov={settDokumentasjonsbehov}
          settMedlemskap={settMedlemskap}
        />
        <Show if={skalViseMedlemskapDialog}>
          <Medlemskap />
        </Show>
      </Show>
    </Side>
  );
};

export default OmDeg;
