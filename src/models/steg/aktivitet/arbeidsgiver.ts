import { IBooleanFelt, IDatoFelt, ISpørsmålFelt, ITekstFelt } from '../../søknad/søknadsfelter';

export interface IArbeidsgiver {
  id: string;
  navn?: ITekstFelt;
  arbeidsmengde?: ITekstFelt;
  ansettelsesforhold?: ISpørsmålFelt;
  harSluttDato?: IBooleanFelt;
  sluttdato?: IDatoFelt;
}
export enum EArbeidsgiver {
  navn = 'navn',
  arbeidsmengde = 'arbeidsmengde',
  ansettelsesforhold = 'ansettelsesforhold',
  harSluttDato = 'harSluttDato',
  sluttdato = 'sluttdato',
}

export enum EStilling {
  fast = 'fast',
  midlertidig = 'midlertidig',
  lærling = 'lærling',
  tilkallingsvakt = 'tilkallingsvakt',
}
