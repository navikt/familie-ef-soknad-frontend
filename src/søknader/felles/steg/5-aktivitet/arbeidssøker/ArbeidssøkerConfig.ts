import { ISpørsmål } from '../../../../../models/felles/spørsmålogsvar';
import { EArbeidssted, EArbeidssøker } from '../../../../../models/steg/aktivitet/arbeidssøker';
import { JaNeiSvar, JaSvar, NeiSvar } from '../../../../../helpers/svar';
import { DokumentasjonIkkeVilligTilArbeid } from '../AktivitetConfig';
import { LokalIntlShape } from '../../../../../language/typer';

export const erSøkerArbeidssøker = (intl: LokalIntlShape): ISpørsmål => ({
  søknadid: EArbeidssøker.registrertSomArbeidssøkerNav,
  tekstid: 'arbeidssøker.label.registrert',
  flersvar: false,
  lesmer: {
    headerTekstid: 'arbeidssøker.hjelpetekst-åpne.registrert',
    innholdTekstid: 'arbeidssøker.hjelpetekst-innhold.registrert',
  },
  svaralternativer: [
    JaSvar(intl),
    { ...NeiSvar(intl), alert_tekstid: 'arbeidssøker.søknad.alert.forÅHaRett' },
  ],
});

export const erVilligTilÅTaImotTilbud = (intl: LokalIntlShape): ISpørsmål => ({
  søknadid: EArbeidssøker.villigTilÅTaImotTilbudOmArbeid,
  tekstid: 'arbeidssøker.label.villig',
  flersvar: false,
  svaralternativer: [
    JaSvar(intl),
    {
      ...NeiSvar(intl),
      alert_tekstid: 'arbeidssøker.alert.villig',
      dokumentasjonsbehov: DokumentasjonIkkeVilligTilArbeid,
    },
  ],
});

export const kanBegynneInnenEnUke = (intl: LokalIntlShape): ISpørsmål => ({
  søknadid: EArbeidssøker.kanBegynneInnenEnUke,
  tekstid: 'arbeidssøker.label.senestEnUke',
  flersvar: false,
  lesmer: {
    headerTekstid: '',
    innholdTekstid: 'arbeidssøker.hjelpetekst-innhold.kanBegynneInnenEnUke',
  },
  svaralternativer: JaNeiSvar(intl),
});

//TODO HVOR BRUKES DENNE?
export const kanSkaffeBarnepassInnenEnUke = (intl: LokalIntlShape): ISpørsmål => ({
  søknadid: EArbeidssøker.kanSkaffeBarnepassInnenEnUke,
  tekstid: 'arbeidssøker.label.barnepass',
  flersvar: false,
  svaralternativer: JaNeiSvar(intl),
});

export const ønsketArbeidssted = (intl: LokalIntlShape): ISpørsmål => ({
  søknadid: EArbeidssøker.hvorØnskerSøkerArbeid,
  tekstid: 'arbeidssøker.label.ønsketArbeidssted',
  flersvar: false,
  lesmer: {
    headerTekstid: 'arbeidssøker.lesmer-åpne.ønsketArbeidssted',
    innholdTekstid: 'arbeidssøker.lesmer-innhold.ønsketArbeidssted',
  },
  svaralternativer: [
    {
      id: EArbeidssted.nærme,
      svar_tekst: intl.formatMessage({ id: 'arbeidssøker.svar.nærme' }),
    },
    {
      id: EArbeidssted.hvorSomHelst,
      svar_tekst: intl.formatMessage({ id: 'arbeidssøker.svar.hvorSomHelst' }),
    },
  ],
});

export const ønskerHalvStilling = (intl: LokalIntlShape): ISpørsmål => ({
  søknadid: EArbeidssøker.ønskerSøker50ProsentStilling,
  tekstid: 'arbeidssøker.label.halvstilling',
  flersvar: false,
  lesmer: {
    headerTekstid: '',
    innholdTekstid: 'arbeidssøker.hjelpetekst-innhold.halvstilling',
  },
  svaralternativer: JaNeiSvar(intl),
});
