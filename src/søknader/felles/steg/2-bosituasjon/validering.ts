import { Søknad } from '../../../../models/søknad/søknad';
import { IBosituasjon } from '../../../../models/steg/bosituasjon';

export const validerBosituasjonSteg = <T extends Søknad>(
  søknad: T,
  bosituasjon: IBosituasjon
): T => {
  return {
    ...søknad,
    bosituasjon: bosituasjon,
  };
};
