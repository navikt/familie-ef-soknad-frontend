export interface Toggles {
  [key: string]: boolean;
}

export enum ToggleName {
  feilsituasjon = 'familie.ef.soknad.feilsituasjon',
  leggTilNynorsk = 'familie.ef.soknad.nynorsk',
  hentSistInnsendteSøknadPerStønad = 'familie.ef.soknad.frontend.hent-sist-innsendte-soknad-per-stonad',
}
