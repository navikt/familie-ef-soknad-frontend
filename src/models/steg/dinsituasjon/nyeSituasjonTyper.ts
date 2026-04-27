import { ISpørsmålFelt } from '../../søknad/søknadsfelter';

export enum ENySituasjon {
  hvaSituasjon = 'hvaSituasjon',
  inntekter = 'inntekter',
}

export enum EHvaSituasjon {
  barnUnder14Måneder = 'barnUnder14Måneder',
  barnSærligTilsyn = 'barnSærligTilsyn',
  barnSykdomIkkeVarig = 'barnSykdomIkkeVarig',
}

export enum EHarInntekt {
  arbeidstaker = 'arbeidstaker',
  selvstendigNæringsdrivende = 'selvstendigNæringsdrivende',
  annenStønadNav = 'annenStønadNav',
  nei = 'nei',
}

export interface INySituasjon {
  hvaSituasjon?: ISpørsmålFelt;
  inntekter?: ISpørsmålFelt;
}
