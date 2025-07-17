import React from 'react';
import { StegSide } from '../../../../../components/v2/side/StegSide';
import { SøknadSteg } from '../../../../../components/v2/stegindikator/GenerelleSøknadSteg';
import { PersonopplysningerV2 } from './personopplysninger/PersonopplysningerV2';
import { useOmDegV2 } from './typer/OmDegContextV2';
import { StegDebugKnapp } from './debug/StegDebugKnapp';
import { SøkerErGiftV2 } from './sivilstatus/SøkerErGiftV2';

export const OmDegV2: React.FC = () => {
  const { søker } = useOmDegV2();

  // TODO: Denne kan komme fra OmDegV2Provider.
  const søknadSteg: SøknadSteg = { id: 'omDeg', stegKey: 'stegtittel.omDeg' };

  return (
    <StegSide søknadSteg={søknadSteg}>
      <PersonopplysningerV2
        personIdent={søker.fnr}
        statsborgerskap={søker.statsborgerskap}
        sivilstatus={søker.sivilstand}
        adresse={søker.adresse.adresse} // TODO: Fix denne så adresse er formatert med post nummer og sted.
      />

      <SøkerErGiftV2 />
      <StegDebugKnapp />
    </StegSide>
  );
};
