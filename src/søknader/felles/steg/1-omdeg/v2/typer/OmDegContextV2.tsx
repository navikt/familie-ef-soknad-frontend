import constate from 'constate';
import { Søknad } from '../../../../../../models/søknad/søknad';
import { Stønadstype } from '../../../../../../models/søknad/stønadstyper';

export interface Props<T extends Søknad> {
  stønadstype: Stønadstype;
  søknad: T;
}

export const [OmDegProviderV2, useOmDegV2] = constate(({ stønadstype, søknad }: Props<Søknad>) => {
  const søker = søknad.person.søker;

  return {
    stønadstype,
    søker,
  };
});
