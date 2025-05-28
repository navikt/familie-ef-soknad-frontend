import { useContext, useEffect, useState } from 'react';
import Feilside from '../components/feil/Feilside';
import hentToggles from '../toggles/api';
import { oppdaterBarnMedLabel } from '../utils/søknad';
import { usePersonContext } from '../context/PersonContext';
import {
  verifiserAtBrukerErAutentisert,
  autentiseringsInterceptor,
} from '../utils/autentiseringogvalidering/autentisering';
import { useBarnetilsynSøknad } from './BarnetilsynContext';
import { useToggles } from '../context/TogglesContext';
import { Barn, PersonData } from '../models/søknad/person';
import { SøknadsdialogBarnetilsyn } from './Søknadsdialog';
import { ESkjemanavn } from '../utils/skjemanavn';
import { useLokalIntlContext } from '../context/LokalIntlContext';
import { Loader } from '@navikt/ds-react';
import { IBarn } from '../models/steg/barn';
import { GjenbrukContext } from '../context/GjenbrukContext';

const BarnetilsynApp = () => {
  const [autentisert, settAutentisering] = useState<boolean>(false);
  const [fetching, settFetching] = useState<boolean>(true);
  const { fetchPersonData, error, settError, feilmelding, alvorlighetsgrad } =
    usePersonContext();
  const {
    settSøknad,
    hentMellomlagretBarnetilsyn,
    hentForrigeSøknadBarnetilsyn,
  } = useBarnetilsynSøknad();
  const { settToggles } = useToggles();
  const intl = useLokalIntlContext();
  const { skalGjenbrukeSøknad } = useContext(GjenbrukContext);

  autentiseringsInterceptor();

  useEffect(() => {
    verifiserAtBrukerErAutentisert(settAutentisering);
  }, [autentisert]);

  const oppdaterSøknadMedBarn = (
    person: PersonData,
    barneliste: Barn[] | IBarn[]
  ) => {
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

  useEffect(() => {
    Promise.all([
      fetchToggles(),
      fetchPersonData(oppdaterSøknadMedBarn, ESkjemanavn.Barnetilsyn),
      hentMellomlagretBarnetilsyn(),
    ])
      .then(() => settFetching(false))
      .catch(() => settFetching(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (skalGjenbrukeSøknad) {
      hentForrigeSøknadBarnetilsyn();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetching, skalGjenbrukeSøknad]);

  if (!fetching && autentisert) {
    if (!error) {
      return (
        <>
          <title>
            {intl.formatMessage({ id: 'banner.tittel.barnetilsyn' })}
          </title>

          <SøknadsdialogBarnetilsyn />
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

export default BarnetilsynApp;
