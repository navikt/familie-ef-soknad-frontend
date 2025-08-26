import { useEffect, useState } from 'react';
import Feilside from '../../components/feil/Feilside';
import { hentPersonDataArbeidssoker } from '../../utils/søknad';
import { Route, Routes } from 'react-router-dom';
import {
  autentiseringsInterceptor,
  verifiserAtBrukerErAutentisert,
} from '../../utils/autentiseringogvalidering/autentisering';
import Forside from './Forside';
import Spørsmål from './steg/1-Spørsmål';
import Oppsummering from './steg/2-Oppsummering';
import Kvittering from './steg/3-Kvittering';
import { SkjemaProvider } from './SkjemaContext';
import RedirectArbeidssoker from './routes/RedirectArbeidssoker';
import { Loader } from '@navikt/ds-react';
import { useToggles } from '../../context/TogglesContext';
import hentToggles from '../../toggles/api';

const App = () => {
  const [autentisert, settAutentisering] = useState<boolean>(false);
  const [fetching, settFetching] = useState<boolean>(true);
  const [error, settError] = useState<boolean>(false);
  const [feilmelding, settFeilmelding] = useState('');
  const [ident, settIdent] = useState<string>('');
  const [visningsnavn, settVisningsnavn] = useState<string>('');
  const personProps = {
    ident,
    visningsnavn,
  };
  const { settToggles } = useToggles();

  autentiseringsInterceptor();

  useEffect(() => {
    const authPromise = verifiserAtBrukerErAutentisert(settAutentisering);

    authPromise?.catch(() => {
      settError(true);
    });
  }, []);

  useEffect(() => {
    const fetchToggles = async () => {
      try {
        return await hentToggles(settToggles);
      } catch {
        settError(true);
      }
    };

    const fetchData = () => {
      const fetchPersonData = async () => {
        try {
          const response = await hentPersonDataArbeidssoker();
          settIdent(response.ident);
          settVisningsnavn(response.visningsnavn);

          await fetchToggles();

          settError(false);
          settFeilmelding('');
        } catch {
          settError(true);
          settFeilmelding('skjema.feilmelding.uthenting');
        }
      };
      fetchPersonData().catch(() => {
        settError(true);
        settFeilmelding('skjema.feilmelding.uthenting');
      });
      settFetching(false);
    };
    fetchData();
  }, [settToggles]);

  if (!fetching && autentisert) {
    if (!error) {
      return (
        <>
          <SkjemaProvider>
            <Routes>
              <Route
                path={'/sporsmal'}
                element={
                  <RedirectArbeidssoker>
                    <Spørsmål ident={personProps.ident} />
                  </RedirectArbeidssoker>
                }
              />
              <Route
                path={'/oppsummering'}
                element={
                  <RedirectArbeidssoker>
                    <Oppsummering />
                  </RedirectArbeidssoker>
                }
              />
              <Route
                path={'/kvittering'}
                element={
                  <RedirectArbeidssoker>
                    <Kvittering />
                  </RedirectArbeidssoker>
                }
              />
              <Route path={'*'} element={<Forside visningsnavn={visningsnavn} />} />
            </Routes>
          </SkjemaProvider>
        </>
      );
    } else if (error) {
      return <Feilside tekstId={feilmelding} />;
    } else {
      return <Loader variant="neutral" size="xlarge" title="venter..." />;
    }
  } else {
    return <Loader variant="neutral" size="xlarge" title="venter..." />;
  }
};

export default App;
