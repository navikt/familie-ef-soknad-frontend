import React, { FC } from 'react';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { useLocation } from 'react-router-dom';
import { erFerdigUtfylt } from '../../../../helpers/steg/bosituasjon';
import { BosituasjonSpørsmål } from './BosituasjonSpørsmål';
import { Side, NavigasjonState } from '../../../../components/side/Side';
import { kommerFraOppsummeringen } from '../../../../utils/locationState';
import { useBosituasjon } from './BosituasjonContext';
import { hentTekst } from '../../../../utils/teksthåndtering';

export const Bosituasjon: FC = () => {
  const intl = useLokalIntlContext();
  const { bosituasjon, stønadstype, routes, mellomlagreSteg, pathOppsummering } = useBosituasjon();
  const location = useLocation();
  const kommerFraOppsummering = kommerFraOppsummeringen(location.state);
  const skalViseKnapper = !kommerFraOppsummering
    ? NavigasjonState.visTilbakeNesteAvbrytKnapp
    : NavigasjonState.visTilbakeTilOppsummeringKnapp;

  return (
    <Side
      stønadstype={stønadstype}
      stegtittel={hentTekst('stegtittel.bosituasjon', intl)}
      skalViseKnapper={skalViseKnapper}
      erSpørsmålBesvart={erFerdigUtfylt(bosituasjon)}
      routesStønad={routes}
      tilbakeTilOppsummeringPath={pathOppsummering}
      mellomlagreSteg={mellomlagreSteg}
    >
      <BosituasjonSpørsmål />
    </Side>
  );
};
