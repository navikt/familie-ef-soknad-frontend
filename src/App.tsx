import { useEffect, useState } from 'react';
import Feilside from './components/feil/Feilside';
import hentToggles from './toggles/api';
import Søknadsdialog from './overgangsstønad/Søknadsdialog';
import { oppdaterBarnMedLabel } from './utils/søknad';
import { usePersonContext } from './context/PersonContext';
import {
  autentiseringsInterceptor,
  verifiserAtBrukerErAutentisert,
} from './utils/autentiseringogvalidering/autentisering';
import { useOvergangsstønadSøknad } from './overgangsstønad/OvergangsstønadContext';
import { useToggles } from './context/TogglesContext';
import { Barn, PersonData } from './models/søknad/person';
import { useLokalIntlContext } from './context/LokalIntlContext';
import { Loader } from '@navikt/ds-react';
import { IBarn } from './models/steg/barn';
import { ESkjemanavn } from './utils/skjemanavn';

const App = () => {
  const [autentisert, settAutentisering] = useState<boolean>(false);
  const [fetching, settFetching] = useState<boolean>(true);
  const { fetchPersonData, error, settError, feilmelding, alvorlighetsgrad } =
    usePersonContext();
  const { settSøknad, hentMellomlagretOvergangsstønad } =
    useOvergangsstønadSøknad();
  const { settToggles } = useToggles();

  const intl = useLokalIntlContext();
  autentiseringsInterceptor();

  useEffect(() => {
    verifiserAtBrukerErAutentisert(settAutentisering);
  }, [autentisert]);

  const oppdaterSøknadMedBarn = (
    person: PersonData,
    barneliste: Barn[] | IBarn[]
  ) => {
    const barnMedLabels = oppdaterBarnMedLabel(barneliste as IBarn[], intl);

    settSøknad((prevSøknad) => ({
      ...prevSøknad,
      person: { ...person, barn: barnMedLabels },
    }));
  };

  const fetchToggles = () => {
    return hentToggles(settToggles).catch(() => {
      settError(true);
    });
  };

  useEffect(() => {
    Promise.all([
      fetchToggles(),
      fetchPersonData(oppdaterSøknadMedBarn, ESkjemanavn.Overgangsstønad),
      hentMellomlagretOvergangsstønad(),
    ])
      .then(() => settFetching(false))
      .catch(() => settFetching(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!fetching && autentisert) {
    if (!error) {
      return (
        <>
          <title>
            {intl.formatMessage({ id: 'banner.tittel.overgangsstønad' })}
          </title>
          <Søknadsdialog />
        </>
      );
    } else if (error) {
      return (
        <Feilside tekstId={feilmelding} alvorlighetsgrad={alvorlighetsgrad} />
      );
    } else {
      return <Loader variant="neutral" size="xlarge" title="venter..." />;
    }
  } else {
    return <Loader variant="neutral" size="xlarge" title="venter..." />;
  }
};

export default App;
