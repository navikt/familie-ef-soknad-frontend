import type React from 'react';
import { useLocation } from 'react-router';
import { NavigasjonState, Side } from '../../../../components/side/Side';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { kommerFraOppsummeringen } from '../../../../utils/locationState';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { BarnasBostedInnhold } from '../../../felles/steg/4-barnasbosted/BarnasBostedInnhold';
import { useBarnasBosted } from './BarnasBostedContext';

export const BarnasBosted: React.FC = () => {
    const intl = useLokalIntlContext();
    const location = useLocation();
    const kommerFraOppsummering = kommerFraOppsummeringen(location.state);
    const navigasjonState = kommerFraOppsummering
        ? NavigasjonState.visTilbakeTilOppsummeringKnapp
        : NavigasjonState.visTilbakeNesteAvbrytKnapp;
    const { sisteBarnUtfylt, stønadstype, routes, mellomlagreSteg, pathOppsummering } = useBarnasBosted();

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
            <BarnasBostedInnhold />
        </Side>
    );
};
