import React, { useState } from 'react';
import { hentTekst } from '../../../../utils/søknad';
import { useLocation } from 'react-router-dom';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { useSkolepengerSøknad } from '../../SkolepengerContext';
import { IBarn } from '../../../../models/steg/barn';
import { RoutesSkolepenger } from '../../routing/routes';
import { pathOppsummeringSkolepenger } from '../../utils';
import Side, { ESide } from '../../../../components/side/Side';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { logSidevisningSkolepenger } from '../../../../utils/amplitude';
import { useMount } from '../../../../utils/hooks';
import { antallBarnMedForeldreUtfylt } from '../../../../utils/barn';
import { kommerFraOppsummeringen } from '../../../../utils/locationState';
import BarnasBostedInnhold from '../../../felles/steg/4-barnasbosted/BarnasBostedInnhold';

const BarnasBosted: React.FC = () => {
  const intl = useLokalIntlContext();
  const location = useLocation();
  const kommerFraOppsummering = kommerFraOppsummeringen(location.state);
  const skalViseKnapper = !kommerFraOppsummering
    ? ESide.visTilbakeNesteAvbrytKnapp
    : ESide.visTilbakeTilOppsummeringKnapp;
  const {
    søknad,
    mellomlagreSkolepenger,
    oppdaterBarnISøknaden,
    oppdaterFlereBarnISøknaden,
    settDokumentasjonsbehovForBarn,
  } = useSkolepengerSøknad();

  useMount(() => logSidevisningSkolepenger('BarnasBosted'));

  const barnMedLevendeForeldre = søknad.person.barn.filter((barn: IBarn) => {
    return !barn.medforelder?.verdi || barn.medforelder?.verdi?.død === false;
  });

  const antallBarnMedForeldre = antallBarnMedForeldreUtfylt(
    barnMedLevendeForeldre
  );
  const [sisteBarnUtfylt, settSisteBarnUtfylt] = useState<boolean>(
    antallBarnMedForeldre === barnMedLevendeForeldre.length
  );

  return (
    <Side
      stønadstype={Stønadstype.skolepenger}
      stegtittel={hentTekst('barnasbosted.sidetittel', intl)}
      skalViseKnapper={skalViseKnapper}
      erSpørsmålBesvart={sisteBarnUtfylt}
      routesStønad={RoutesSkolepenger}
      mellomlagreStønad={mellomlagreSkolepenger}
      tilbakeTilOppsummeringPath={pathOppsummeringSkolepenger}
    >
      <BarnasBostedInnhold
        aktuelleBarn={søknad.person.barn}
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
