import React from 'react';
import { useLocation } from 'react-router-dom';
import { PersonopplysningerV2 } from './personopplysninger/PersonopplysningerV2';
import { useOmDegV2 } from './typer/OmDegContextV2';
import { Adresseopplysninger } from './personopplysninger/Adresseopplysninger';
import { MedlemskapV2 } from './medlemskap/MedlemskapV2';
import { SivilstatusV2 } from './sivilstatus/SivilstatusV2';
import { skalViseMedlemskap, skalViseSivilstatus } from './typer/OmDegV2Helpers';
import Side, { ESide } from '../../../../../components/side/Side';
import { hentTekst } from '../../../../../utils/teksthåndtering';
import { kommerFraOppsummeringen } from '../../../../../utils/locationState';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';

export const OmDegV2: React.FC = () => {
  const intl = useLokalIntlContext();
  const location = useLocation();
  const kommerFraOppsummering = kommerFraOppsummeringen(location.state);

  const {
    stønadstype,
    søker,
    personopplysningerData,
    sivilstatusData,
    mellomlagreSteg,
    routes,
    pathOppsummering,
    erAlleSpørsmålBesvart,
  } = useOmDegV2();

  const skalViseKnapper = !kommerFraOppsummering
    ? ESide.visTilbakeNesteAvbrytKnapp
    : ESide.visTilbakeTilOppsummeringKnapp;

  const visSivilstatus = skalViseSivilstatus(personopplysningerData);
  const visMedlemskap = skalViseMedlemskap(personopplysningerData, sivilstatusData);

  return (
    <Side
      stønadstype={stønadstype}
      stegtittel={hentTekst('stegtittel.omDeg', intl)}
      erSpørsmålBesvart={erAlleSpørsmålBesvart()}
      skalViseKnapper={skalViseKnapper}
      routesStønad={routes}
      tilbakeTilOppsummeringPath={pathOppsummering}
      mellomlagreSteg={mellomlagreSteg}
    >
      <PersonopplysningerV2
        personIdent={søker.fnr}
        statsborgerskap={søker.statsborgerskap}
        sivilstatus={søker.sivilstand}
        adresse={søker.adresse}
      />

      <Adresseopplysninger />
      {visSivilstatus && <SivilstatusV2 />}
      {visMedlemskap && <MedlemskapV2 />}
    </Side>
  );
};
