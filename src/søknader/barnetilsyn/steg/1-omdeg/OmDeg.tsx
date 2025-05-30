import React, { FC } from 'react';
import { useLocation } from 'react-router-dom';
import {
  erSivilstandSpørsmålBesvart,
  erStegFerdigUtfylt,
  erÅrsakEnsligBesvart,
  søkerBorPåRegistrertAdresseEllerHarMeldtAdresseendring,
} from '../../../../helpers/steg/omdeg';
import { useBarnetilsynSøknad } from '../../BarnetilsynContext';
import { IMedlemskap } from '../../../../models/steg/omDeg/medlemskap';
import Medlemskap from '../../../felles/steg/1-omdeg/medlemskap/Medlemskap';
import Personopplysninger from '../../../felles/steg/1-omdeg/personopplysninger/Personopplysninger';
import { ISpørsmålBooleanFelt } from '../../../../models/søknad/søknadsfelter';
import Sivilstatus from '../../../felles/steg/1-omdeg/sivilstatus/Sivilstatus';
import { ISivilstatus } from '../../../../models/steg/omDeg/sivilstatus';
import Side, { ESide } from '../../../../components/side/Side';
import { RoutesBarnetilsyn } from '../../routing/routesBarnetilsyn';
import { hentPathBarnetilsynOppsummering } from '../../utils';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import Show from '../../../../utils/showIf';
import { logSidevisningBarnetilsyn } from '../../../../utils/amplitude';
import { useMount } from '../../../../utils/hooks';
import { SøknadBarnetilsyn } from '../../models/søknad';
import { kommerFraOppsummeringen } from '../../../../utils/locationState';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';

const OmDeg: FC = () => {
  useMount(() => logSidevisningBarnetilsyn('OmDeg'));
  const intl = useLokalIntlContext();
  const location = useLocation();
  const kommerFraOppsummering = kommerFraOppsummeringen(location.state);
  const skalViseKnapper = !kommerFraOppsummering
    ? ESide.visTilbakeNesteAvbrytKnapp
    : ESide.visTilbakeTilOppsummeringKnapp;
  const {
    søknad,
    mellomlagreBarnetilsyn,
    settSøknad,
    settDokumentasjonsbehov,
  } = useBarnetilsynSøknad();
  const { sivilstatus, medlemskap } = søknad;
  const { søker } = søknad.person;

  const settMedlemskap = (medlemskap: IMedlemskap) => {
    settSøknad((prevSoknad: SøknadBarnetilsyn) => {
      return {
        ...prevSoknad,
        medlemskap:
          Object.keys(medlemskap).length !== 0
            ? medlemskap
            : prevSoknad.medlemskap,
      };
    });
  };

  const settSøkerBorPåRegistrertAdresse = (
    søkerBorPåRegistrertAdresse: ISpørsmålBooleanFelt
  ) => {
    settSøknad((prevSoknad: SøknadBarnetilsyn) => {
      return {
        ...prevSoknad,
        adresseopplysninger: undefined,
        søkerBorPåRegistrertAdresse: søkerBorPåRegistrertAdresse,
      };
    });
  };

  const settHarMeldtAdresseendring = (
    harMeldtAdresseendring: ISpørsmålBooleanFelt
  ) => {
    settSøknad((prevSøknad: SøknadBarnetilsyn) => ({
      ...prevSøknad,
      adresseopplysninger: {
        ...prevSøknad.adresseopplysninger,
        harMeldtAdresseendring,
      },
    }));
  };

  const settSivilstatus = (sivilstatus: ISivilstatus) => {
    settSøknad((prevSoknad: SøknadBarnetilsyn) => {
      return {
        ...prevSoknad,
        sivilstatus: sivilstatus,
      };
    });
  };

  const erSøkerBorPåRegistrertAdresseEllerHarMeldtAdresseendring =
    søkerBorPåRegistrertAdresseEllerHarMeldtAdresseendring(søknad);

  const erAlleSpørsmålBesvart = erStegFerdigUtfylt(
    sivilstatus,
    søker.sivilstand,
    medlemskap,
    erSøkerBorPåRegistrertAdresseEllerHarMeldtAdresseendring
  );

  return (
    <Side
      stønadstype={Stønadstype.barnetilsyn}
      stegtittel={intl.formatMessage({ id: 'stegtittel.omDeg' })}
      erSpørsmålBesvart={erAlleSpørsmålBesvart}
      skalViseKnapper={skalViseKnapper}
      routesStønad={RoutesBarnetilsyn}
      mellomlagreStønad={mellomlagreBarnetilsyn}
      tilbakeTilOppsummeringPath={hentPathBarnetilsynOppsummering}
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
        stønadstype={Stønadstype.barnetilsyn}
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
            erSivilstandSpørsmålBesvart(søker.sivilstand, sivilstatus) &&
            erÅrsakEnsligBesvart(sivilstatus)
          }
        >
          <Medlemskap medlemskap={medlemskap} settMedlemskap={settMedlemskap} />
        </Show>
      </Show>
    </Side>
  );
};

export default OmDeg;
