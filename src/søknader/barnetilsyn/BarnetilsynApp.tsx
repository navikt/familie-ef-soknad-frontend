import { useContext, useEffect, useState } from 'react';
import Feilside from '../../components/feil/Feilside';
import hentToggles from '../../toggles/api';
import { oppdaterBarnMedLabel } from '../../utils/søknad';
import { usePersonContext } from '../../context/PersonContext';
import {
  autentiseringsInterceptor,
  verifiserAtBrukerErAutentisert,
} from '../../utils/autentiseringogvalidering/autentisering';
import { useBarnetilsynSøknad } from './BarnetilsynContext';
import { useToggles } from '../../context/TogglesContext';
import { Barn, PersonData } from '../../models/søknad/person';
import SøknadsdialogBarnetilsyn from './Søknadsdialog';
import { ESkjemanavn } from '../../utils/skjemanavn';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { Loader } from '@navikt/ds-react';
import { IBarn } from '../../models/steg/barn';
import { GjenbrukContext } from '../../context/GjenbrukContext';
import { hentTekst } from '../../utils/teksthåndtering';
import {
  hentHarGyldigBarnetilsynVedRegelendring,
  hentOvergangsstonadPåGammeltRegelverk,
} from '../../innsending/api';
import { useTidligereVedtak } from '../../context/TidligereVedtakContext';

const BarnetilsynApp = () => {
  const [autentisert, settAutentisering] = useState<boolean>(false);
  const [fetching, settFetching] = useState<boolean>(true);
  const { fetchPersonData, error, settError, feilmelding, alvorlighetsgrad } = usePersonContext();
  const { settSøknad, hentMellomlagretBarnetilsyn, hentForrigeSøknadBarnetilsyn } =
    useBarnetilsynSøknad();
  const { settToggles } = useToggles();
  const intl = useLokalIntlContext();
  const { skalGjenbrukeSøknad } = useContext(GjenbrukContext);
  const { settHarTidligereOvergangsstønadStatus, settHarLøpendeBarnetilsynVedRegelendring2026 } =
    useTidligereVedtak();

  autentiseringsInterceptor();

  useEffect(() => {
    verifiserAtBrukerErAutentisert(settAutentisering);
  }, [autentisert]);

  const oppdaterSøknadMedBarn = (person: PersonData, barneliste: Barn[] | IBarn[]) => {
    const barnMedLabels = oppdaterBarnMedLabel(barneliste as IBarn[], intl);

    settSøknad((prevSøknad) => {
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

  const hentOgSettTidligereOvergangsstønadStatus = () => {
    return hentOvergangsstonadPåGammeltRegelverk()
      .then((status) => settHarTidligereOvergangsstønadStatus(status))
      .catch(() => settHarTidligereOvergangsstønadStatus('VET_IKKE'));
  };

  const hentOgSettHarLøpendeBarnetilsynVedRegelendring = () => {
    return hentHarGyldigBarnetilsynVedRegelendring()
      .then((harLøpende) => settHarLøpendeBarnetilsynVedRegelendring2026(harLøpende))
      .catch(() => settHarLøpendeBarnetilsynVedRegelendring2026(false));
  };

  useEffect(() => {
    Promise.all([
      fetchToggles(),
      fetchPersonData(oppdaterSøknadMedBarn, ESkjemanavn.Barnetilsyn),
      hentMellomlagretBarnetilsyn(),
      hentOgSettTidligereOvergangsstønadStatus(),
      hentOgSettHarLøpendeBarnetilsynVedRegelendring(),
    ])
      .then(() => settFetching(false))
      .catch(() => settFetching(false));
  }, []);

  useEffect(() => {
    if (skalGjenbrukeSøknad) {
      hentForrigeSøknadBarnetilsyn();
    }
  }, [fetching, skalGjenbrukeSøknad]);

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
