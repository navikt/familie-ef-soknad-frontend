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
import { hentVedtakPåGammeltRegelverk } from '../../innsending/api';
import { useTidligereVedtak } from '../../context/TidligereVedtakContext';
import { ToggleName } from '../../models/søknad/toggles';

export const OvergangsstønadApp = () => {
  const [autentisert, settAutentisering] = useState<boolean>(false);
  const [fetching, settFetching] = useState<boolean>(true);
  const { fetchPersonData, error, settError, feilmelding, alvorlighetsgrad } = usePersonContext();
  const { settSøknad, hentMellomlagretOvergangsstønad } = useOvergangsstønadSøknad();
  const { settToggles } = useToggles();
  const { settTidligereVedtakStatus } = useTidligereVedtak();

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

  const hentTidligereVedtakGammeltRegelverk = (toggles: Record<string, boolean> | void) => {
    if (!toggles || !toggles[ToggleName.overgangsstønadRegelendringer2026]) {
      settTidligereVedtakStatus('VET_IKKE');
      return Promise.resolve();
    }

    return hentVedtakPåGammeltRegelverk()
      .then((status) => settTidligereVedtakStatus(status))
      .catch(() => settTidligereVedtakStatus('VET_IKKE'));
  };

  useEffect(() => {
    fetchToggles()
      .then((toggles) =>
        Promise.all([
          fetchPersonData(oppdaterSøknadMedBarn, ESkjemanavn.Overgangsstønad),
          hentMellomlagretOvergangsstønad(),
          hentTidligereVedtakGammeltRegelverk(toggles),
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
