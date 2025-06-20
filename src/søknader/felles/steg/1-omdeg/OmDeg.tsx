import React, { FC } from 'react';
import { useLocation } from 'react-router-dom';
import {
  erSivilstandSpørsmålBesvart,
  erStegFerdigUtfylt,
  erÅrsakEnsligBesvart,
  søkerBorPåRegistrertAdresseEllerHarMeldtAdresseendring,
} from '../../../../helpers/steg/omdeg';
import Medlemskap from '../../../felles/steg/1-omdeg/medlemskap/Medlemskap';
import Personopplysninger from '../../../felles/steg/1-omdeg/personopplysninger/Personopplysninger';
import { ISpørsmålBooleanFelt } from '../../../../models/søknad/søknadsfelter';
import Sivilstatus from '../../../felles/steg/1-omdeg/sivilstatus/Sivilstatus';
import Side, { ESide } from '../../../../components/side/Side';
import { kommerFraOppsummeringen } from '../../../../utils/locationState';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { useOmDeg } from './OmDegContext';

const OmDeg: FC = () => {
  const intl = useLokalIntlContext();
  const location = useLocation();
  const kommerFraOppsummering = kommerFraOppsummeringen(location.state);
  const skalViseKnapper = !kommerFraOppsummering
    ? ESide.visTilbakeNesteAvbrytKnapp
    : ESide.visTilbakeTilOppsummeringKnapp;

  const {
    sivilstatus,
    medlemskap,
    mellomlagreSteg,
    stønadstype,
    routes,
    pathOppsummering,
    settDokumentasjonsbehov,
    søknad,
    oppdaterSøknad,
  } = useOmDeg();

  const { søker } = søknad.person;
  const settSøkerBorPåRegistrertAdresse = (søkerBorPåRegistrertAdresse: ISpørsmålBooleanFelt) =>
    oppdaterSøknad({
      ...søknad,
      adresseopplysninger: undefined,
      søkerBorPåRegistrertAdresse: søkerBorPåRegistrertAdresse,
    });

  const settHarMeldtAdresseendring = (harMeldtAdresseendring: ISpørsmålBooleanFelt) =>
    oppdaterSøknad({
      ...søknad,
      adresseopplysninger: {
        ...søknad.adresseopplysninger,
        harMeldtAdresseendring,
      },
    });

  const erSøkerBorPåRegistrertAdresseEllerHarMeldtAdresseendring =
    søkerBorPåRegistrertAdresseEllerHarMeldtAdresseendring(søknad);

  const erAlleSpørsmålBesvart = erStegFerdigUtfylt(
    sivilstatus,
    søker.sivilstand,
    medlemskap,
    erSøkerBorPåRegistrertAdresseEllerHarMeldtAdresseendring
  );

  const skalViseMedlemskapsdialog =
    erSivilstandSpørsmålBesvart(søker.sivilstand, sivilstatus) && erÅrsakEnsligBesvart(sivilstatus);
  return (
    <Side
      stønadstype={stønadstype}
      stegtittel={intl.formatMessage({ id: 'stegtittel.omDeg' })}
      erSpørsmålBesvart={erAlleSpørsmålBesvart}
      skalViseKnapper={skalViseKnapper}
      routesStønad={routes}
      tilbakeTilOppsummeringPath={pathOppsummering}
      mellomlagreSteg={mellomlagreSteg}
    >
      <Personopplysninger
        søker={søker}
        settDokumentasjonsbehov={settDokumentasjonsbehov}
        søkerBorPåRegistrertAdresse={søknad.søkerBorPåRegistrertAdresse}
        settSøkerBorPåRegistrertAdresse={settSøkerBorPåRegistrertAdresse}
        harMeldtAdresseendring={søknad.adresseopplysninger?.harMeldtAdresseendring}
        settHarMeldtAdresseendring={settHarMeldtAdresseendring}
        stønadstype={stønadstype}
      />

      {erSøkerBorPåRegistrertAdresseEllerHarMeldtAdresseendring && <Sivilstatus />}

      {skalViseMedlemskapsdialog && <Medlemskap />}
    </Side>
  );
};

export default OmDeg;
