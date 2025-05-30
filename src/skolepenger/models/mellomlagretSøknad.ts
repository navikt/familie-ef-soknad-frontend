import { SøknadSkolepenger } from './søknad';

export interface MellomlagretSøknadSkolepenger {
  søknad: SøknadSkolepenger;
  modellVersjon: number;
  gjeldendeSteg: string;
  locale: string;
}
