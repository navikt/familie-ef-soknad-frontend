import React, { useState } from 'react';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { useLocation } from 'react-router-dom';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { useBarnetilsynSøknad } from '../../BarnetilsynContext';
import { IBarn } from '../../../../models/steg/barn';
import { RoutesBarnetilsyn } from '../../routing/routesBarnetilsyn';
import { pathOppsummeringBarnetilsyn } from '../../utils';
import { Side, NavigasjonState } from '../../../../components/side/Side';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { logSidevisningBarnetilsyn } from '../../../../utils/amplitude';
import { useMount } from '../../../../utils/hooks';
import { antallBarnMedForeldreUtfylt } from '../../../../utils/barn';
import { kommerFraOppsummeringen } from '../../../../utils/locationState';
import BarnasBostedInnhold from '../../../felles/steg/4-barnasbosted/BarnasBostedInnhold';

const BarnasBosted: React.FC = () => {
  const intl = useLokalIntlContext();
  const location = useLocation();
  const {
    søknad,
    mellomlagreBarnetilsyn,
    settDokumentasjonsbehovForBarn,
    oppdaterBarnISøknaden,
    oppdaterFlereBarnISøknaden,
  } = useBarnetilsynSøknad();

  useMount(() => logSidevisningBarnetilsyn('BarnasBosted'));

  const aktuelleBarn = søknad.person.barn.filter((barn: IBarn) => barn.skalHaBarnepass?.verdi);

  const barnMedLevendeForeldre = aktuelleBarn.filter((barn: IBarn) => {
    return !barn.medforelder?.verdi || barn.medforelder?.verdi?.død === false;
  });

  const kommerFraOppsummering = kommerFraOppsummeringen(location.state);
  const skalViseKnapper = !kommerFraOppsummering
    ? NavigasjonState.visTilbakeNesteAvbrytKnapp
    : NavigasjonState.visTilbakeTilOppsummeringKnapp;

  const [sisteBarnUtfylt, settSisteBarnUtfylt] = useState<boolean>(
    antallBarnMedForeldreUtfylt(barnMedLevendeForeldre) === barnMedLevendeForeldre.length
  );

  return (
    <Side
      stønadstype={Stønadstype.barnetilsyn}
      stegtittel={hentTekst('barnasbosted.sidetittel', intl)}
      skalViseKnapper={skalViseKnapper}
      erSpørsmålBesvart={sisteBarnUtfylt}
      routesStønad={RoutesBarnetilsyn}
      mellomlagreStønad={mellomlagreBarnetilsyn}
      tilbakeTilOppsummeringPath={pathOppsummeringBarnetilsyn}
    >
      <BarnasBostedInnhold
        aktuelleBarn={aktuelleBarn}
        oppdaterBarnISøknaden={oppdaterBarnISøknaden}
        oppdaterFlereBarnISøknaden={oppdaterFlereBarnISøknaden}
        settDokumentasjonsbehovForBarn={settDokumentasjonsbehovForBarn}
        sisteBarnUtfylt={sisteBarnUtfylt}
        settSisteBarnUtfylt={settSisteBarnUtfylt}
        søknad={søknad}
      />
    </Side>
  );
};

export default BarnasBosted;
