import { SøknadOvergangsstønad } from './søknad';

export interface IMellomlagretOvergangsstønad {
  søknad: SøknadOvergangsstønad;
  modellVersjon: number;
  gjeldendeSteg: string;
  locale: string;
}
