import React, { FC } from 'react';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { IBosituasjon } from '../../../../models/steg/bosituasjon';
import { useLocation } from 'react-router-dom';
import { erFerdigUtfylt } from '../../../../helpers/steg/bosituasjon';
import { useBarnetilsynSøknad } from '../../BarnetilsynContext';
import BosituasjonSpørsmål from '../../../felles/steg/2-bosituasjon/BosituasjonSpørsmål';
import Side, { ESide } from '../../../../components/side/Side';
import { RoutesBarnetilsyn } from '../../routing/routesBarnetilsyn';
import { pathOppsummeringBarnetilsyn } from '../../utils';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';

import { logSidevisningBarnetilsyn } from '../../../../utils/amplitude';
import { useMount } from '../../../../utils/hooks';
import { SøknadBarnetilsyn } from '../../models/søknad';
import { kommerFraOppsummeringen } from '../../../../utils/locationState';

const Bosituasjon: FC = () => {
  useMount(() => logSidevisningBarnetilsyn('Bosituasjon'));

  const intl = useLokalIntlContext();
  const {
    søknad,
    settSøknad,
    settDokumentasjonsbehov,
    mellomlagreBarnetilsyn,
  } = useBarnetilsynSøknad();
  const bosituasjon = søknad.bosituasjon;
  const location = useLocation();
  const kommerFraOppsummering = kommerFraOppsummeringen(location.state);
  const skalViseKnapper = !kommerFraOppsummering
    ? ESide.visTilbakeNesteAvbrytKnapp
    : ESide.visTilbakeTilOppsummeringKnapp;

  const settBosituasjon = (bosituasjon: IBosituasjon) => {
    settSøknad((prevSoknad: SøknadBarnetilsyn) => {
      return {
        ...prevSoknad,
        bosituasjon: bosituasjon,
      };
    });
  };

  return (
    <Side
      stønadstype={Stønadstype.barnetilsyn}
      stegtittel={intl.formatMessage({ id: 'stegtittel.bosituasjon' })}
      skalViseKnapper={skalViseKnapper}
      erSpørsmålBesvart={erFerdigUtfylt(bosituasjon)}
      routesStønad={RoutesBarnetilsyn}
      mellomlagreStønad={mellomlagreBarnetilsyn}
      tilbakeTilOppsummeringPath={pathOppsummeringBarnetilsyn}
    >
      <BosituasjonSpørsmål
        bosituasjon={bosituasjon}
        settBosituasjon={settBosituasjon}
        settDokumentasjonsbehov={settDokumentasjonsbehov}
      />
    </Side>
  );
};
export default Bosituasjon;
