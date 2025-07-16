import React from 'react';
import { StegSide } from '../../../../../components/v2/side/StegSide';
import { SøknadSteg } from '../../../../../components/v2/stegindikator/GenerelleSøknadSteg';

export const OmDegV2: React.FC = () => {
  const søknadSteg: SøknadSteg = { id: 'omDeg', stegKey: 'stegtittel.omDeg' };

  return <StegSide søknadSteg={søknadSteg} />;
};
