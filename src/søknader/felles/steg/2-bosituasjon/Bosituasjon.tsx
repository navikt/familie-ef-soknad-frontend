import React, { type FC } from 'react';
import { useLocation } from 'react-router';
import { NavigasjonState, Side } from '../../../../components/side/Side';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { erFerdigUtfylt } from '../../../../helpers/steg/bosituasjon';
import { kommerFraOppsummeringen } from '../../../../utils/locationState';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { useBosituasjon } from './BosituasjonContext';
import { BosituasjonSpørsmål } from './BosituasjonSpørsmål';

export const Bosituasjon: FC = () => {
    const intl = useLokalIntlContext();
    const { bosituasjon, stønadstype, routes, mellomlagreSteg, pathOppsummering } = useBosituasjon();
    const location = useLocation();
    const kommerFraOppsummering = kommerFraOppsummeringen(location.state);
    const navigasjonState = kommerFraOppsummering
        ? NavigasjonState.visTilbakeTilOppsummeringKnapp
        : NavigasjonState.visTilbakeNesteAvbrytKnapp;

    return (
        <Side
            stønadstype={stønadstype}
            stegtittel={hentTekst('stegtittel.bosituasjon', intl)}
            navigasjonState={navigasjonState}
            erSpørsmålBesvart={erFerdigUtfylt(bosituasjon)}
            routesStønad={routes}
            tilbakeTilOppsummeringPath={pathOppsummering}
            mellomlagreSteg={mellomlagreSteg}
        >
            <BosituasjonSpørsmål />
        </Side>
    );
};
