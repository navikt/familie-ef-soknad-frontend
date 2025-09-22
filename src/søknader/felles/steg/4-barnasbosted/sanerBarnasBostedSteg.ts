import { Søknad } from '../../../../models/søknad/søknad';
import { IBarn } from '../../../../models/steg/barn';

export const sanerBarnasBostedSteg = <T extends Søknad>(søknad: T, barneListe: IBarn[]): T => {
  return { ...søknad, person: { ...søknad.person, barn: barneListe } };
};
