import React from 'react';
import { StegSide } from './komponenter/side/StegSide';
import { SøknadSteg } from './komponenter/stegindikator/GenerelleSøknadSteg';
import { PersonopplysningerV2 } from './personopplysninger/PersonopplysningerV2';
import { useOmDegV2 } from './typer/OmDegContextV2';
import { StegDebugKnapp } from './debug/StegDebugKnapp';
import { Adresseopplysninger } from './personopplysninger/Adresseopplysninger';
import { MedlemskapV2 } from './medlemskap/MedlemskapV2';
import { SivilstatusV2 } from './sivilstatus/SivilstatusV2';
import { skalViseMedlemskap, skalViseSivilstatus } from './typer/OmDegV2Helpers';

export const OmDegV2: React.FC = () => {
  const { stønadstype, søker, personopplysningerData, sivilstatusData } = useOmDegV2();

  // TODO: Denne kan komme fra OmDegV2Provider.
  const søknadSteg: SøknadSteg = { id: 'omDeg', stegKey: 'stegtittel.omDeg' };

  const visSivilstatus = skalViseSivilstatus(personopplysningerData);
  const visMedlemskap = skalViseMedlemskap(sivilstatusData);

  return (
    <StegSide stønadstype={stønadstype} søknadSteg={søknadSteg}>
      <PersonopplysningerV2
        personIdent={søker.fnr}
        statsborgerskap={søker.statsborgerskap}
        sivilstatus={søker.sivilstand}
        adresse={søker.adresse.adresse} // TODO: Fix denne så adresse er formatert med post nummer og sted.
      />

      <Adresseopplysninger />
      {visSivilstatus && <SivilstatusV2 />}
      {visMedlemskap && <MedlemskapV2 />}

      <StegDebugKnapp />
    </StegSide>
  );
};
