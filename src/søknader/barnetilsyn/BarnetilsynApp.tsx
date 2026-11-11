import { Loader } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import Feilside from '../../components/feil/Feilside';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { usePersonContext } from '../../context/PersonContext';
import { useTidligereVedtak } from '../../context/TidligereVedtakContext';
import { useToggles } from '../../context/TogglesContext';
import { hentHarGyldigBarnetilsynVedRegelendring } from '../../innsending/api';
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
import { useBarnetilsynSøknad } from './BarnetilsynContext';
import SøknadsdialogBarnetilsyn from './Søknadsdialog';

const BarnetilsynApp = () => {
    const [autentisert, settAutentisering] = useState<boolean>(false);
    const [fetching, settFetching] = useState<boolean>(true);
    const { fetchPersonData, error, settError, feilmelding, alvorlighetsgrad } = usePersonContext();
    const { settSøknad, hentMellomlagretBarnetilsyn } = useBarnetilsynSøknad();
    const { settToggles } = useToggles();
    const intl = useLokalIntlContext();
    const { settHarLøpendeBarnetilsynVedRegelendring2026 } = useTidligereVedtak();

    autentiseringsInterceptor();

    useEffect(() => {
        verifiserAtBrukerErAutentisert(settAutentisering);
    }, [autentisert]);

    const oppdaterSøknadMedBarn = (person: PersonData, barneliste: Barn[] | IBarn[]) => {
        const barnMedLabels = oppdaterBarnMedLabel(barneliste as IBarn[], intl);

        settSøknad(prevSøknad => {
            const prevBarn = prevSøknad.person.barn;

            const sortertBarnelistePåMedforelder = [...prevBarn, ...barnMedLabels];
            return {
                ...prevSøknad,
                person: { ...person, barn: sortertBarnelistePåMedforelder },
            };
        });
    };

    const fetchToggles = () => {
        return hentToggles(settToggles).catch(() => {
            settError(true);
        });
    };

    const hentOgSettHarLøpendeBarnetilsynVedRegelendring = () => {
        return hentHarGyldigBarnetilsynVedRegelendring()
            .then(harLøpende => settHarLøpendeBarnetilsynVedRegelendring2026(harLøpende))
            .catch(() => settHarLøpendeBarnetilsynVedRegelendring2026(false));
    };

    useEffect(() => {
        Promise.all([
            fetchToggles(),
            fetchPersonData(oppdaterSøknadMedBarn, ESkjemanavn.Barnetilsyn),
            hentMellomlagretBarnetilsyn(),
            hentOgSettHarLøpendeBarnetilsynVedRegelendring(),
        ])
            .then(() => settFetching(false))
            .catch(() => settFetching(false));
    }, []);

    if (!fetching && autentisert) {
        if (!error) {
            return (
                <>
                    <title>{hentTekst('banner.tittel.barnetilsyn', intl)}</title>
                    <SøknadsdialogBarnetilsyn />
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

export default BarnetilsynApp;
