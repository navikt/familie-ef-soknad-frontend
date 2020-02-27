import { ISpørsmål, JaNeiSvar } from '../../../../models/spørsmal';
import {
  EArbeidssted,
  EArbeidssøker,
} from '../../../../models/arbeidssituasjon/arbeidssøker';

export const erSøkerArbeidssøker: ISpørsmål = {
  søknadid: EArbeidssøker.registrertSomArbeidssøkerNav,
  tekstid: 'arbeidssøker.label.registrert',
  svaralternativer: JaNeiSvar,
};

export const erVilligTilÅTaImotTilbud: ISpørsmål = {
  søknadid: EArbeidssøker.villigTilÅTaImotTilbudOmArbeid,
  tekstid: 'arbeidssøker.label.villig',
  svaralternativer: JaNeiSvar,
};

export const kanBegynneInnenEnUke: ISpørsmål = {
  søknadid: EArbeidssøker.kanBegynneInnenEnUke,
  tekstid: 'arbeidssøker.label.senestEnUke',
  svaralternativer: JaNeiSvar,
};

export const kanSkaffeBarnepassInnenEnUke: ISpørsmål = {
  søknadid: EArbeidssøker.kanSkaffeBarnepassInnenEnUke,
  tekstid: 'arbeidssøker.label.barnepass',
  svaralternativer: JaNeiSvar,
};

export const ønsketArbeidssted: ISpørsmål = {
  søknadid: EArbeidssøker.hvorØnskerSøkerArbeid,
  tekstid: 'arbeidssøker.label.ønsketSøkested',
  lesmer: {
    åpneTekstid: 'arbeidssøker.lesmer-åpne.ønsketArbeidsted',
    innholdTekstid: 'arbeidssøker.lesmer-innhold.ønsketArbeidsted',
    lukkeTekstid: '',
  },
  svaralternativer: [
    {
      nøkkel: EArbeidssted.nærme,
      svar_tekstid: 'arbeidssøker.svar.nærme',
    },
    {
      nøkkel: EArbeidssted.hvorSomHelst,
      svar_tekstid: 'arbeidssøker.svar.hvorSomHelst',
    },
  ],
};

export const ønskerHalvStillig: ISpørsmål = {
  søknadid: EArbeidssøker.ønskerSøker50ProsentStilling,
  tekstid: 'arbeidssøker.label.halvstilling',
  svaralternativer: JaNeiSvar,
};
