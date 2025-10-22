import { useEffect, useState } from 'react';
import Feilside from '../../components/feil/Feilside';
import hentToggles from '../../toggles/api';
import Søknadsdialog from './Søknadsdialog';
import { oppdaterBarnMedLabel } from '../../utils/søknad';
import { usePersonContext } from '../../context/PersonContext';
import {
  autentiseringsInterceptor,
  verifiserAtBrukerErAutentisert,
} from '../../utils/autentiseringogvalidering/autentisering';
import { useOvergangsstønadSøknad } from './OvergangsstønadContext';
import { useToggles } from '../../context/TogglesContext';
import { Barn, PersonData } from '../../models/søknad/person';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { Loader } from '@navikt/ds-react';
import { IBarn } from '../../models/steg/barn';
import { ESkjemanavn } from '../../utils/skjemanavn';
import { hentTekst } from '../../utils/teksthåndtering';

export const OvergangsstønadApp = () => {
  const [autentisert, settAutentisering] = useState<boolean>(false);
  const [fetching, settFetching] = useState<boolean>(true);
  const { fetchPersonData, error, settError, feilmelding, alvorlighetsgrad } = usePersonContext();
  const { settSøknad, hentMellomlagretOvergangsstønad } = useOvergangsstønadSøknad();
  const { settToggles } = useToggles();

  const intl = useLokalIntlContext();
  autentiseringsInterceptor();

  useEffect(() => {
    verifiserAtBrukerErAutentisert(settAutentisering);
  }, [autentisert]);

  const oppdaterSøknadMedBarn = (person: PersonData, barneliste: Barn[] | IBarn[]) => {
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
