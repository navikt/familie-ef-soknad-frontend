export interface ITekstFelt {
  label: string;
  verdi: string;
}

export interface IBooleanFelt {
  label: string;
  verdi: boolean;
}

export interface JaNeiUbesvartFelt {
  label: string;
  verdi: BooleanOgUbesvart;
}

export interface IDatoFelt {
  label: string;
  verdi: string;
}

export interface ITekstListeFelt {
  label: string;
  verdi: string[];
}

export interface ISpørsmålFelt extends ITekstFelt {
  spørsmålid: string;
  svarid: string;
}

export interface ISpørsmålBooleanFelt extends IBooleanFelt {
  spørsmålid: string;
  svarid: string;
}

export interface SpørsmålJaNeiUbesvartFelt extends JaNeiUbesvartFelt {
  spørsmålid: string;
  svarid: string;
}

export interface ISpørsmålListeFelt extends ITekstListeFelt {
  spørsmålid: string;
  svarid: string[];
  alternativer: string[];
}

export enum BooleanOgUbesvart {
  Ja = 'Ja',
  Nei = 'Nei',
  Ubesvart = 'Ubesvart',
}
