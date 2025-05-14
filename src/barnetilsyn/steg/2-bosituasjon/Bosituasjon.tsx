import React, { FC, useState } from 'react';
import { useLokalIntlContext } from '../../../context/LokalIntlContext';
import {
  Bo3,
  DelerBoligMedAndreVoksne,
  IBosituasjon,
} from '../../../models/steg/bosituasjon';
import { useLocation } from 'react-router-dom';
import { erFerdigUtfylt } from '../../../helpers/steg/bosituasjon';
import { useBarnetilsynSøknad } from '../../BarnetilsynContext';
import Side, { ESide } from '../../../components/side/Side';
import { RoutesBarnetilsyn } from '../../routing/routesBarnetilsyn';
import { hentPathBarnetilsynOppsummering } from '../../utils';
import { Stønadstype } from '../../../models/søknad/stønadstyper';

import { logSidevisningBarnetilsyn } from '../../../utils/amplitude';
import { useMount } from '../../../utils/hooks';
import { ISøknad } from '../../models/søknad';
import { kommerFraOppsummeringen } from '../../../utils/locationState';
import BosituasjonSpørsmål2 from '../../../søknad/steg/2-bosituasjon/BosituasjonSpørsmål2';

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

  const bositsj2Init: Bo3 = {
    hovedSpørsmål: DelerBoligMedAndreVoksne.IKKEBESVART,
  };

  const [bosituasjon2, settBosituasjon2] = useState<Bo3>(bositsj2Init);

  const settBosituasjon = (bosituasjon: IBosituasjon) => {
    settSøknad((prevSoknad: ISøknad) => {
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
      tilbakeTilOppsummeringPath={hentPathBarnetilsynOppsummering}
    >
      <BosituasjonSpørsmål2
        bosituasjon={bosituasjon}
        settBosituasjon={settBosituasjon}
        settDokumentasjonsbehov={settDokumentasjonsbehov}
        bosituasjon2={bosituasjon2}
        settBosituasjon2={settBosituasjon2}
      />
    </Side>
  );
};
export default Bosituasjon;
