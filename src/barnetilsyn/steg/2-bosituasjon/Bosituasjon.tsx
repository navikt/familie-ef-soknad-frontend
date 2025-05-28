import React, { FC } from 'react';
import { useLokalIntlContext } from '../../../context/LokalIntlContext';
import { useBarnetilsynSøknad } from '../../BarnetilsynContext';
import BosituasjonSpørsmål from '../../../søknad/steg/2-bosituasjon/BosituasjonSpørsmål';
import Side from '../../../components/side/Side';
import { RoutesBarnetilsyn } from '../../routing/routesBarnetilsyn';
import { hentPathBarnetilsynOppsummering } from '../../utils';
import { Stønadstype } from '../../../models/søknad/stønadstyper';
import { useBosituasjon } from './BosituasjonContext';

export const Bosituasjon: FC = () => {
  const intl = useLokalIntlContext();
  const { settDokumentasjonsbehov } = useBarnetilsynSøknad();
  const {
    bosituasjon,
    oppdaterBosituasjon,
    mellomlagreBosituasjon,
    visNavigeringKnapper,
    bosituasjonErFerdigUtfylt,
  } = useBosituasjon();

  return (
    <Side
      stønadstype={Stønadstype.barnetilsyn}
      stegtittel={intl.formatMessage({ id: 'stegtittel.bosituasjon' })}
      skalViseKnapper={visNavigeringKnapper}
      erSpørsmålBesvart={bosituasjonErFerdigUtfylt}
      routesStønad={RoutesBarnetilsyn}
      mellomlagreSøknad={mellomlagreBosituasjon}
      tilbakeTilOppsummeringPath={hentPathBarnetilsynOppsummering}
    >
      <BosituasjonSpørsmål
        bosituasjon={bosituasjon}
        settBosituasjon={oppdaterBosituasjon}
        settDokumentasjonsbehov={settDokumentasjonsbehov}
      />
    </Side>
  );
};
