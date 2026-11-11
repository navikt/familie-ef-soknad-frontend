import { Loader } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import Feilside from '../../components/feil/Feilside';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { usePersonContext } from '../../context/PersonContext';
import { useToggles } from '../../context/TogglesContext';
import type { IBarn } from '../../models/steg/barn';
import type { Barn, PersonData } from '../../models/søknad/person';
import hentToggles from '../../toggles/api';
import {
    autentiseringsInterceptor,
    verifiserAtBrukerErAutentisert,
} from '../../utils/autentiseringogvalidering/autentisering';
import { ESkjemanavn } from '../../utils/skjemanavn';
import { oppdaterBarnMedLabel } from '../../utils/søknad';
import { hentTekst } from '../../utils/teksthåndtering';
import { useSkolepengerSøknad } from './SkolepengerContext';
import SøknadsdialogSkolepenger from './Søknadsdialog';

const SkolepengerApp = () => {
    const [autentisert, settAutentisering] = useState<boolean>(false);
    const [fetching, settFetching] = useState<boolean>(true);
    const { fetchPersonData, error, settError, feilmelding, alvorlighetsgrad } = usePersonContext();
    const { søknad, settSøknad, hentMellomlagretSkolepenger } = useSkolepengerSøknad();
    const { settToggles } = useToggles();
    const intl = useLokalIntlContext();

    autentiseringsInterceptor();

    useEffect(() => {
        verifiserAtBrukerErAutentisert(settAutentisering);
    }, [autentisert]);

    const oppdaterSøknadMedBarn = (person: PersonData, barneliste: Barn[] | IBarn[]) => {
        const barnMedLabels = oppdaterBarnMedLabel(barneliste as IBarn[], intl);

        settSøknad && settSøknad({ ...søknad, person: { ...person, barn: barnMedLabels } });
    };

    const fetchToggles = () => {
        return hentToggles(settToggles).catch(() => {
            settError(true);
        });
    };

    useEffect(() => {
        Promise.all([
            fetchToggles(),
            fetchPersonData(oppdaterSøknadMedBarn, ESkjemanavn.Skolepenger),
            hentMellomlagretSkolepenger(),
        ])
            .then(() => settFetching(false))
            .catch(() => settFetching(false));
    }, []);

    if (!fetching && autentisert) {
        if (!error) {
            return (
                <>
                    <title>{hentTekst('skolepenger.sidetittel', intl)}</title>
                    <SøknadsdialogSkolepenger />
                </>
            );
        } else if (error) {
            return <Feilside tekstId={feilmelding} alvorlighetsgrad={alvorlighetsgrad} />;
        } else {
            return <Loader variant="neutral" size="xlarge" title="venter..." />;
        }
    } else {
        return <Loader variant="neutral" size="xlarge" title="venter..." />;
    }
};

export default SkolepengerApp;
