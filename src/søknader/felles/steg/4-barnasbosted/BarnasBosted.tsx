import React, { useState } from 'react';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { useLocation } from 'react-router-dom';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { NavigasjonState, Side } from '../../../../components/side/Side';
import { antallBarnMedForeldreUtfylt } from '../../../../utils/barn';
import { kommerFraOppsummeringen } from '../../../../utils/locationState';
import BarnasBostedInnhold from '../../../felles/steg/4-barnasbosted/BarnasBostedInnhold';
import { useBarnasBosted } from './BarnasBostedContext';
import { IBarn } from '../../../../models/steg/barn';

export const BarnasBosted: React.FC = () => {
  const intl = useLokalIntlContext();
  const location = useLocation();
  const kommerFraOppsummering = kommerFraOppsummeringen(location.state);
  const navigasjonState = kommerFraOppsummering
    ? NavigasjonState.visTilbakeTilOppsummeringKnapp
    : NavigasjonState.visTilbakeNesteAvbrytKnapp;
  const { aktuelleBarn, stønadstype, routes, mellomlagreSteg, pathOppsummering } =
    useBarnasBosted();

  const barnMedLevendeMedforelder = aktuelleBarn.filter((barn: IBarn) => {
    return !barn.medforelder?.verdi || barn.medforelder?.verdi?.død === false;
  });

  const [sisteBarnUtfylt, settSisteBarnUtfylt] = useState<boolean>(
    antallBarnMedForeldreUtfylt(barnMedLevendeMedforelder) === barnMedLevendeMedforelder.length
  );

  return (
    <Side
      stønadstype={stønadstype}
      stegtittel={hentTekst('barnasbosted.sidetittel', intl)}
      navigasjonState={navigasjonState}
      erSpørsmålBesvart={sisteBarnUtfylt}
      routesStønad={routes}
      mellomlagreStønad={mellomlagreSteg}
      tilbakeTilOppsummeringPath={pathOppsummering}
    >
      <BarnasBostedInnhold
        sisteBarnUtfylt={sisteBarnUtfylt}
        settSisteBarnUtfylt={settSisteBarnUtfylt}
      />
    </Side>
  );
};
