import { SøknadOvergangsstønad } from '../../models/søknad';
import constate from 'constate';

export interface Props {
  søknad: SøknadOvergangsstønad;
  oppdaterSøknad: (søknad: SøknadOvergangsstønad) => void;
}

export const [MerOmDinSituasjonProvider, useMerOmDinSituasjon] = constate(
  ({ søknad, oppdaterSøknad }: Props) => {
    return {
      søknad,
      oppdaterSøknad,
    };
  }
);
