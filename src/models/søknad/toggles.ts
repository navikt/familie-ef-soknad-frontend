export interface Toggles {
  [key: string]: boolean;
}

export enum ToggleName {
  feilsituasjon = 'familie.ef.soknad.feilsituasjon',
  leggTilNynorsk = 'familie.ef.soknad.nynorsk',
  visNyInnsendingsknapp = 'familie-ef.soknad-ny-pdfkvittering',
}
