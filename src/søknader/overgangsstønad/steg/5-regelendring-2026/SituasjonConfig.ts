import { ISpørsmål } from '../../../../models/felles/spørsmålogsvar';
import {
  InntekterId,
  HvaSituasjon,
  SituasjonId,
} from '../../../../models/steg/dinsituasjon/situasjonTyper';
import { DokumentasjonBarnetilsynBehov } from '../../../felles/steg/6-meromsituasjon/SituasjonConfig';
import { DokumentasjonsConfig } from '../../../felles/DokumentasjonsConfig';
import { LokalIntlShape } from '../../../../language/typer';
import { hentTekst } from '../../../../utils/teksthåndtering';

export const hvaSituasjonSpm = (intl: LokalIntlShape): ISpørsmål => ({
  søknadid: SituasjonId.hvaSituasjon,
  tekstid: 'nySituasjon.spm.hvaSituasjon',
  flersvar: true,
  lesmer: {
    headerTekstid: 'situasjon.hjelpetekst-åpne.begrunnelse',
    innholdTekstid: 'situasjon.hjelpetekst.innhold',
  },
  svaralternativer: [
    {
      id: HvaSituasjon.barnUnder14Måneder,
      svar_tekst: hentTekst('nySituasjon.svar.barnUnder14Måneder', intl),
    },
    {
      id: HvaSituasjon.barnSærligTilsyn,
      svar_tekst: hentTekst('nySituasjon.svar.barnSærligTilsyn', intl),
      dokumentasjonsbehov: DokumentasjonBarnetilsynBehov,
    },
    {
      id: HvaSituasjon.barnSykdomIkkeVarig,
      svar_tekst: hentTekst('nySituasjon.svar.barnSykdomIkkeVarig', intl),
      dokumentasjonsbehov: DokumentasjonsConfig.DokumentasjonSyktBarn,
    },
    {
      id: HvaSituasjon.ingenAvDisseGjelderMeg,
      svar_tekst: hentTekst('nySituasjon.svar.ingenAvDisseGjelderMeg', intl),
    },
  ],
});

export const inntekterSpm = (intl: LokalIntlShape): ISpørsmål => ({
  søknadid: SituasjonId.inntekter,
  tekstid: 'nySituasjon.spm.inntekter',
  flersvar: true,
  lesmer: {
    headerTekstid: 'situasjon.hjelpetekst-åpne.begrunnelse',
    innholdTekstid: 'inntekter.hjelpetekst.innhold',
  },
  svaralternativer: [
    {
      id: InntekterId.arbeidstaker,
      svar_tekst: hentTekst('nySituasjon.svar.arbeidstaker', intl),
    },
    {
      id: InntekterId.selvstendigNæringsdrivende,
      svar_tekst: hentTekst('nySituasjon.svar.selvstendigNæringsdrivende', intl),
    },
    {
      id: InntekterId.annenStønadNav,
      svar_tekst: hentTekst('nySituasjon.svar.annenStønadNav', intl),
    },
    {
      id: InntekterId.nei,
      svar_tekst: hentTekst('svar.nei', intl),
    },
  ],
});
