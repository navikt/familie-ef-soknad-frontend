import { Loader } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import Feilside from '../../components/feil/Feilside';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { usePersonContext } from '../../context/PersonContext';
import { useTidligereVedtak } from '../../context/TidligereVedtakContext';
import { useToggles } from '../../context/TogglesContext';
import { hentOvergangsstonadPåGammeltRegelverk } from '../../innsending/api';
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
import { useOvergangsstønadSøknad } from './OvergangsstønadContext';
import Søknadsdialog from './Søknadsdialog';

export const OvergangsstønadApp = () => {
    const [autentisert, settAutentisering] = useState<boolean>(false);
    const [fetching, settFetching] = useState<boolean>(true);
    const { fetchPersonData, error, settError, feilmelding, alvorlighetsgrad } = usePersonContext();
    const { settSøknad, hentMellomlagretOvergangsstønad } = useOvergangsstønadSøknad();
    const { settToggles } = useToggles();
    const { settHarTidligereOvergangsstønadStatus } = useTidligereVedtak();

    const intl = useLokalIntlContext();
    autentiseringsInterceptor();

    useEffect(() => {
        verifiserAtBrukerErAutentisert(settAutentisering);
    }, [autentisert]);

    const oppdaterSøknadMedBarn = (person: PersonData, barneliste: Barn[] | IBarn[]) => {
        const barnMedLabels = oppdaterBarnMedLabel(barneliste as IBarn[], intl);

        settSøknad(prevSøknad => ({
            ...prevSøknad,
            person: { ...person, barn: barnMedLabels },
        }));
    };

    const fetchToggles = () => {
        return hentToggles(settToggles).catch(() => {
            settError(true);
        });
    };

    const hentTidligereOvergangsstonadGammeltRegelverk = (toggles: Record<string, boolean> | void) => {
        if (!toggles) {
            settHarTidligereOvergangsstønadStatus('VET_IKKE');
            return Promise.resolve();
        }

        return hentOvergangsstonadPåGammeltRegelverk()
            .then(status => settHarTidligereOvergangsstønadStatus(status))
            .catch(() => settHarTidligereOvergangsstønadStatus('VET_IKKE'));
    };

    useEffect(() => {
        fetchToggles()
            .then(toggles =>
                Promise.all([
                    fetchPersonData(oppdaterSøknadMedBarn, ESkjemanavn.Overgangsstønad),
                    hentMellomlagretOvergangsstønad(),
                    hentTidligereOvergangsstonadGammeltRegelverk(toggles),
                ])
            )
            .then(() => settFetching(false))
            .catch(() => settFetching(false));
    }, []);

    if (!fetching && autentisert) {
        if (!error) {
            return (
                <>
                    <title>{hentTekst('banner.tittel.overgangsstønad', intl)}</title>
                    <Søknadsdialog />
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
