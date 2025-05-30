import { SøknadBarnetilsyn } from './søknad';

export interface MellomlagretSøknadBarnetilsyn {
  søknad: SøknadBarnetilsyn;
  modellVersjon: number;
  gjeldendeSteg: string;
  locale: string;
}
