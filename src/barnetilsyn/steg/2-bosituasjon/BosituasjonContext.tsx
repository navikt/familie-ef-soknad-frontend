import createUseContext from 'constate';
import { useState } from 'react';
import { IBosituasjon } from '../../../models/steg/bosituasjon';
import { useBarnetilsynSøknad } from '../../BarnetilsynContext';
import { useLocation } from 'react-router-dom';
import { kommerFraOppsummeringen } from '../../../utils/locationState';
import { ESide } from '../../../components/side/Side';
import { erFerdigUtfylt } from '../../../helpers/steg/bosituasjon';

const [BosituasjonProvider, useBosituasjon] = createUseContext(() => {
  const { søknad, mellomlagreBarnetilsynV2 } = useBarnetilsynSøknad();

  const location = useLocation();

  const [bosituasjon, settBosituasjon] = useState<IBosituasjon>(
    søknad.bosituasjon
  );

  const oppdaterBosituasjon = (bosituasjon: IBosituasjon) => {
    settBosituasjon((prevState) => {
      return { ...prevState, ...bosituasjon };
    });
  };

  const mellomlagreBosituasjon = () => {
    const oppdatertSøknad = {
      ...søknad,
      bosituasjon: bosituasjon,
    };
    mellomlagreBarnetilsynV2(oppdatertSøknad, location.pathname);
  };

  const kommerFraOppsummeringSide = kommerFraOppsummeringen(location.state);
  const visNavigeringKnapper = kommerFraOppsummeringSide
    ? ESide.visTilbakeTilOppsummeringKnapp
    : ESide.visTilbakeNesteAvbrytKnapp;

  const bosituasjonErFerdigUtfylt = erFerdigUtfylt(bosituasjon);

  return {
    bosituasjon,
    oppdaterBosituasjon,
    mellomlagreBosituasjon,
    visNavigeringKnapper,
    bosituasjonErFerdigUtfylt,
  };
});

export { BosituasjonProvider, useBosituasjon };
