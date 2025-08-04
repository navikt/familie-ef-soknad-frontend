import React from 'react';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { useLocation } from 'react-router-dom';
import { erAllUtdanningFerdigUtfyltForSkolepenger } from '../../../../helpers/steg/aktivitetvalidering';
import { Side, NavigasjonState } from '../../../../components/side/Side';
import { RoutesSkolepenger } from '../../routing/routes';
import { pathOppsummeringSkolepenger } from '../../utils';
import { DetaljertUtdanning } from '../../models/detaljertUtdanning';
import { useSkolepengerSøknad } from '../../SkolepengerContext';
import TarUtdanning from '../../../felles/steg/5-aktivitet/utdanning/TarUtdanning';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';

import { logSidevisningSkolepenger } from '../../../../utils/amplitude';
import { useMount } from '../../../../utils/hooks';
import { SøknadSkolepenger } from '../../models/søknad';
import { kommerFraOppsummeringen } from '../../../../utils/locationState';
import { hentTekst } from '../../../../utils/teksthåndtering';

const UtdanningSituasjon: React.FC = () => {
  const intl = useLokalIntlContext();
  const { søknad, settSøknad, mellomlagreSkolepenger } = useSkolepengerSøknad();
  const location = useLocation();
  const kommerFraOppsummering = kommerFraOppsummeringen(location.state);
  const navigasjonState = kommerFraOppsummering
    ? NavigasjonState.visTilbakeTilOppsummeringKnapp
    : NavigasjonState.visTilbakeNesteAvbrytKnapp;

  useMount(() => logSidevisningSkolepenger('Aktivitet'));

  const oppdaterUnderUtdanning = (underUtdanning: DetaljertUtdanning) => {
    settSøknad((prevSøknad: SøknadSkolepenger) => {
      return { ...prevSøknad, utdanning: underUtdanning };
    });
  };

  const erSisteSpørsmålBesvartOgMinstEttAlternativValgt = erAllUtdanningFerdigUtfyltForSkolepenger(
    søknad.utdanning
  );

  return (
    <Side
      stønadstype={Stønadstype.skolepenger}
      stegtittel={hentTekst('stegtittel.utdanning', intl)}
      navigasjonState={navigasjonState}
      erSpørsmålBesvart={erSisteSpørsmålBesvartOgMinstEttAlternativValgt}
      mellomlagreStønad={mellomlagreSkolepenger}
      routesStønad={RoutesSkolepenger}
      tilbakeTilOppsummeringPath={pathOppsummeringSkolepenger}
    >
      <TarUtdanning
        underUtdanning={søknad.utdanning}
        oppdaterUnderUtdanning={oppdaterUnderUtdanning}
        stønadstype={Stønadstype.skolepenger}
      />
    </Side>
  );
};

export default UtdanningSituasjon;
