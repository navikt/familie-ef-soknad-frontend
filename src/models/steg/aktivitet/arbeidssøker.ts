import { ISpørsmålBooleanFelt, ISpørsmålFelt } from '../../søknad/søknadsfelter';

export interface IArbeidssøker {
  registrertSomArbeidssøkerNav?: ISpørsmålBooleanFelt;
  villigTilÅTaImotTilbudOmArbeid?: ISpørsmålBooleanFelt;
  kanBegynneInnenEnUke?: ISpørsmålBooleanFelt;
  kanSkaffeBarnepassInnenEnUke?: ISpørsmålBooleanFelt;
  hvorØnskerSøkerArbeid?: ISpørsmålFelt;
  ønskerSøker50ProsentStilling?: ISpørsmålBooleanFelt;
}

export enum EArbeidssøker {
  registrertSomArbeidssøkerNav = 'registrertSomArbeidssøkerNav',
  villigTilÅTaImotTilbudOmArbeid = 'villigTilÅTaImotTilbudOmArbeid',
  kanBegynneInnenEnUke = 'kanBegynneInnenEnUke',
  kanSkaffeBarnepassInnenEnUke = 'kanSkaffeBarnepassInnenEnUke',
  hvorØnskerSøkerArbeid = 'hvorØnskerSøkerArbeid',
  ønskerSøker50ProsentStilling = 'ønskerSøker50ProsentStilling',
}

export enum EArbeidssted {
  nærme = 'nærme',
  hvorSomHelst = 'hvorSomHelst',
}
