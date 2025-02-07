import React, { FC } from 'react';
import { useLokalIntlContext } from '../../../context/LokalIntlContext';
import { useSøknad } from '../../../context/SøknadContext';
import { IBosituasjon } from '../../../models/steg/bosituasjon';
import { useLocation } from 'react-router-dom';
import { erFerdigUtfylt } from '../../../helpers/steg/bosituasjon';
import BosituasjonSpørsmål from '../../../søknad/steg/2-bosituasjon/BosituasjonSpørsmål';
import { RoutesOvergangsstonad } from '../../routing/routesOvergangsstonad';
import { hentPathOvergangsstønadOppsummering } from '../../utils';
import Side, { ESide } from '../../../components/side/Side';
import { Stønadstype } from '../../../models/søknad/stønadstyper';
import { ISøknad } from '../../../models/søknad/søknad';
import { kommerFraOppsummeringen } from '../../../utils/locationState';

const Bosituasjon: FC = () => {
  const intl = useLokalIntlContext();
  const {
    søknad,
    settSøknad,
    settDokumentasjonsbehov,
    mellomlagreOvergangsstønad,
  } = useSøknad();
  const bosituasjon = søknad.bosituasjon;
  const location = useLocation();
  const kommerFraOppsummering = kommerFraOppsummeringen(location.state);
  const skalViseKnapper = !kommerFraOppsummering
    ? ESide.visTilbakeNesteAvbrytKnapp
    : ESide.visTilbakeTilOppsummeringKnapp;

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
      stønadstype={Stønadstype.overgangsstønad}
      stegtittel={intl.formatMessage({ id: 'stegtittel.bosituasjon' })}
      skalViseKnapper={skalViseKnapper}
      erSpørsmålBesvart={erFerdigUtfylt(bosituasjon)}
      routesStønad={RoutesOvergangsstonad}
      mellomlagreStønad={mellomlagreOvergangsstønad}
      tilbakeTilOppsummeringPath={hentPathOvergangsstønadOppsummering}
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
