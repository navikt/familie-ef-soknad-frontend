import React, { FC } from 'react';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { IBosituasjon } from '../../../../models/steg/bosituasjon';
import { useLocation } from 'react-router-dom';
import { erFerdigUtfylt } from '../../../../helpers/steg/bosituasjon';
import { useSkolepengerSøknad } from '../../SkolepengerContext';
import BosituasjonSpørsmål from '../../../felles/steg/2-bosituasjon/BosituasjonSpørsmål';
import Side, { ESide } from '../../../../components/side/Side';
import { RoutesSkolepenger } from '../../routing/routes';
import { pathOppsummeringSkolepenger } from '../../utils';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';

import { logSidevisningSkolepenger } from '../../../../utils/amplitude';
import { useMount } from '../../../../utils/hooks';
import { SøknadSkolepenger } from '../../models/søknad';
import { kommerFraOppsummeringen } from '../../../../utils/locationState';

const Bosituasjon: FC = () => {
  const intl = useLokalIntlContext();
  const { søknad, settSøknad, settDokumentasjonsbehov, mellomlagreSkolepenger } =
    useSkolepengerSøknad();
  const bosituasjon = søknad.bosituasjon;
  const location = useLocation();
  const kommerFraOppsummering = kommerFraOppsummeringen(location.state);
  const skalViseKnapper = !kommerFraOppsummering
    ? ESide.visTilbakeNesteAvbrytKnapp
    : ESide.visTilbakeTilOppsummeringKnapp;

  useMount(() => logSidevisningSkolepenger('Bosituasjon'));

  const settBosituasjon = (bosituasjon: IBosituasjon) => {
    settSøknad((prevSoknad: SøknadSkolepenger) => {
      return {
        ...prevSoknad,
        bosituasjon: bosituasjon,
      };
    });
  };

  return (
    <Side
      stønadstype={Stønadstype.skolepenger}
      stegtittel={intl.formatMessage({ id: 'stegtittel.bosituasjon' })}
      skalViseKnapper={skalViseKnapper}
      erSpørsmålBesvart={erFerdigUtfylt(bosituasjon)}
      routesStønad={RoutesSkolepenger}
      mellomlagreStønad={mellomlagreSkolepenger}
      tilbakeTilOppsummeringPath={pathOppsummeringSkolepenger}
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
