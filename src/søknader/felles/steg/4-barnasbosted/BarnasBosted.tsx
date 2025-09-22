import React from 'react';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { useLocation } from 'react-router-dom';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { NavigasjonState, Side } from '../../../../components/side/Side';
import { kommerFraOppsummeringen } from '../../../../utils/locationState';
import BarnasBostedInnhold from '../../../felles/steg/4-barnasbosted/BarnasBostedInnhold';
import { useBarnasBosted } from './BarnasBostedContext';

export const BarnasBosted: React.FC = () => {
  const intl = useLokalIntlContext();
  const location = useLocation();
  const kommerFraOppsummering = kommerFraOppsummeringen(location.state);
  const navigasjonState = kommerFraOppsummering
    ? NavigasjonState.visTilbakeTilOppsummeringKnapp
    : NavigasjonState.visTilbakeNesteAvbrytKnapp;
  const { sisteBarnUtfylt, stønadstype, routes, mellomlagreSteg, pathOppsummering } =
    useBarnasBosted();

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
      <BarnasBostedInnhold />
    </Side>
  );
};
