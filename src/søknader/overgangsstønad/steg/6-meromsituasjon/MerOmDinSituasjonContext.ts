import { SøknadOvergangsstønad } from '../../models/søknad';
import constate from 'constate';

export interface Props {
  søknad: SøknadOvergangsstønad;
}

export const [MerOmDinSituasjonProvider, useMerOmDinSituasjon] = constate(({ søknad }: Props) => {
  return {
    søknad,
  };
});
