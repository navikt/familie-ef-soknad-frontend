import React from 'react';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { useLocation } from 'react-router-dom';
import { erAllUtdanningFerdigUtfyltForSkolepenger } from '../../../../helpers/steg/aktivitetvalidering';
import { NavigasjonState, Side } from '../../../../components/side/Side';
import { RoutesSkolepenger } from '../../routing/routes';
import { pathOppsummeringSkolepenger } from '../../utils';
import { DetaljertUtdanning } from '../../models/detaljertUtdanning';
import { TarUtdanning } from '../../../felles/steg/5-aktivitet/utdanning/TarUtdanning';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { kommerFraOppsummeringen } from '../../../../utils/locationState';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { useUtdanningSituasjon } from './UtdanningSituasjonContext';

const UtdanningSituasjon: React.FC = () => {
  const intl = useLokalIntlContext();

  const { utdanning, settUtdanning, mellomlagreSteg } = useUtdanningSituasjon();

  const location = useLocation();

  const kommerFraOppsummering = kommerFraOppsummeringen(location.state);

  const navigasjonState = kommerFraOppsummering
    ? NavigasjonState.visTilbakeTilOppsummeringKnapp
    : NavigasjonState.visTilbakeNesteAvbrytKnapp;

  const oppdaterUnderUtdanning = (underUtdanning: DetaljertUtdanning) => {
    settUtdanning(underUtdanning);
  };

  const erSisteSpørsmålBesvartOgMinstEttAlternativValgt =
    erAllUtdanningFerdigUtfyltForSkolepenger(utdanning);

  return (
    <Side
      stønadstype={Stønadstype.skolepenger}
      stegtittel={hentTekst('stegtittel.utdanning', intl)}
      navigasjonState={navigasjonState}
      erSpørsmålBesvart={erSisteSpørsmålBesvartOgMinstEttAlternativValgt}
      mellomlagreStønad={mellomlagreSteg}
      routesStønad={RoutesSkolepenger}
      tilbakeTilOppsummeringPath={pathOppsummeringSkolepenger}
    >
      <TarUtdanning
        underUtdanning={utdanning}
        oppdaterUnderUtdanning={oppdaterUnderUtdanning}
        stønadstype={Stønadstype.skolepenger}
      />
    </Side>
  );
};

export default UtdanningSituasjon;
