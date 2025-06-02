import { SøknadOvergangsstønad } from './søknad';

export interface MellomlagretSøknadOvergangsstønad {
  søknad: SøknadOvergangsstønad;
  modellVersjon: number;
  gjeldendeSteg: string;
  locale: string;
}
