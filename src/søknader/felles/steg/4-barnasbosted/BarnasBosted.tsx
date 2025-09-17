import React, { useState } from 'react';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { useLocation } from 'react-router-dom';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { IBarn } from '../../../../models/steg/barn';
import { NavigasjonState, Side } from '../../../../components/side/Side';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { antallBarnMedForeldreUtfylt } from '../../../../utils/barn';
import { kommerFraOppsummeringen } from '../../../../utils/locationState';
import BarnasBostedInnhold from '../../../felles/steg/4-barnasbosted/BarnasBostedInnhold';
import { useBarnasBosted } from './BarnasBostedContext';

export const BarnasBosted: React.FC = () => {
  const intl = useLokalIntlContext();
  const location = useLocation();
  const kommerFraOppsummering = kommerFraOppsummeringen(location.state);
  const navigasjonState = kommerFraOppsummering
    ? NavigasjonState.visTilbakeTilOppsummeringKnapp
    : NavigasjonState.visTilbakeNesteAvbrytKnapp;
  const {
    stønadstype,
    søknad,
    routes,
    mellomlagreSteg,
    pathOppsummering,
    oppdaterBarnISøknaden,
    oppdaterFlereBarnISøknaden,
    settDokumentasjonsbehovForBarn,
  } = useBarnasBosted();

  const aktuelleBarn =
    stønadstype === Stønadstype.barnetilsyn
      ? søknad.person.barn.filter((barn: IBarn) => barn.skalHaBarnepass?.verdi)
      : søknad.person.barn;

  const barnMedLevendeForeldre = aktuelleBarn.filter((barn: IBarn) => {
    return !barn.medforelder?.verdi || barn.medforelder?.verdi?.død === false;
  });

  const [sisteBarnUtfylt, settSisteBarnUtfylt] = useState<boolean>(
    antallBarnMedForeldreUtfylt(barnMedLevendeForeldre) === barnMedLevendeForeldre.length
  );

  return (
    <Side
      stønadstype={stønadstype}
      stegtittel={hentTekst('barnasbosted.sidetittel', intl)}
      navigasjonState={navigasjonState}
      erSpørsmålBesvart={sisteBarnUtfylt}
      routesStønad={routes}
      mellomlagreStønad={mellomlagreSteg}
      tilbakeTilOppsummeringPath={pathOppsummering}
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
