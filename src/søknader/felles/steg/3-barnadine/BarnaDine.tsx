import type React from 'react';
import { NavigasjonState, Side } from '../../../../components/side/Side';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import type { IBarn } from '../../../../models/steg/barn';
import { oppdaterBarnIBarneliste } from '../../../../utils/barn';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { useBarnaDine } from './BarnaDineContext';
import { BarnaDineInnhold } from './BarnaDineInnhold';

export const BarnaDine: React.FC = () => {
    const intl = useLokalIntlContext();

    const {
        stønadstype,
        barneliste,
        settBarneliste,
        mellomlagreSteg,
        routes,
        pathOppsummering,
        settDokumentasjonsbehovForBarn,
    } = useBarnaDine();

    const navigasjonState = NavigasjonState.visTilbakeNesteAvbrytKnapp;
    const harMinstEttBarn = barneliste.length > 0;

    const oppdaterBarnISøknaden = (oppdatertBarn: IBarn) => {
        settBarneliste(oppdaterBarnIBarneliste(barneliste, oppdatertBarn));
    };

    const fjernBarnFraSøknad = (id: string) => {
        const nyBarneListe = barneliste.filter((barn: IBarn) => barn.id !== id);
        settBarneliste(nyBarneListe);
    };

    return (
        <Side
            stønadstype={stønadstype}
            stegtittel={hentTekst('barnadine.sidetittel', intl)}
            navigasjonState={navigasjonState}
            erSpørsmålBesvart={harMinstEttBarn}
            routesStønad={routes}
            mellomlagreSteg={mellomlagreSteg}
            tilbakeTilOppsummeringPath={pathOppsummering}
            informasjonstekstId="barnadine.info.brukpdf"
        >
            <BarnaDineInnhold
                barneliste={barneliste}
                oppdaterBarnISøknaden={oppdaterBarnISøknaden}
                fjernBarnFraSøknad={fjernBarnFraSøknad}
                settDokumentasjonsbehovForBarn={settDokumentasjonsbehovForBarn}
            />
        </Side>
    );
};
