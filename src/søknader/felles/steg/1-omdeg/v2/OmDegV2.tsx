import React from 'react';
import { StegSide } from '../../../../../components/v2/side/StegSide';
import { SøknadSteg } from '../../../../../components/v2/stegindikator/GenerelleSøknadSteg';
import { PersonopplysningerV2 } from './personopplysninger/PersonopplysningerV2';
import { useOmDegV2 } from './typer/OmDegContextV2';
import { StegDebugKnapp } from './debug/StegDebugKnapp';
import { Adresseopplysninger } from './personopplysninger/Adresseopplysninger';
import { SivilstatusV2 } from './sivilstatus/SivilstatusV2';
import { MedlemskapV2 } from './medlemskap/MedlemskapV2';

export const OmDegV2: React.FC = () => {
  const { søker, personopplysningerData } = useOmDegV2();

  // TODO: Denne kan komme fra OmDegV2Provider.
  const søknadSteg: SøknadSteg = { id: 'omDeg', stegKey: 'stegtittel.omDeg' };

  // TODO: Denne må mulig flyttes.
  const skalViseSivilstatus = (): boolean => {
    const { søkerBorPåRegistrertAdresse, søkerHarMeldtAdresseEndring } = personopplysningerData;

    if (søkerBorPåRegistrertAdresse === true) {
      return true;
    }

    return søkerBorPåRegistrertAdresse === false && søkerHarMeldtAdresseEndring === true;
  };

  const skalViseMedlemskap = true;

  return (
    <StegSide søknadSteg={søknadSteg}>
      <PersonopplysningerV2
        personIdent={søker.fnr}
        statsborgerskap={søker.statsborgerskap}
        sivilstatus={søker.sivilstand}
        adresse={søker.adresse.adresse} // TODO: Fix denne så adresse er formatert med post nummer og sted.
      />

      {/*<Adresseopplysninger />
      {skalViseSivilstatus() && <SivilstatusV2 />}*/}

      {skalViseMedlemskap && <MedlemskapV2 />}

      <StegDebugKnapp />
    </StegSide>
  );
};
