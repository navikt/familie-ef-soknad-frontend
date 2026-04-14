import { ISpørsmål } from '../../../../models/felles/spørsmålogsvar';
import {
  EHarInntekt,
  EHvaSituasjon,
  ENySituasjon,
} from '../../../../models/steg/dinsituasjon/nyeSituasjonTyper';
import { DokumentasjonBarnetilsynBehov } from '../../../felles/steg/6-meromsituasjon/SituasjonConfig';
import { DokumentasjonsConfig } from '../../../felles/DokumentasjonsConfig';
import { LokalIntlShape } from '../../../../language/typer';
import { hentTekst } from '../../../../utils/teksthåndtering';

export const hvaSituasjonSpm = (intl: LokalIntlShape): ISpørsmål => ({
  søknadid: ENySituasjon.hvaSituasjon,
  tekstid: 'nySituasjon.spm.hvaSituasjon',
  flersvar: true,
  svaralternativer: [
    {
      id: EHvaSituasjon.barnUnder14Måneder,
      svar_tekst: hentTekst('nySituasjon.svar.barnUnder14Måneder', intl),
    },
    {
      id: EHvaSituasjon.barnSærligTilsyn,
      svar_tekst: hentTekst('nySituasjon.svar.barnSærligTilsyn', intl),
      dokumentasjonsbehov: DokumentasjonBarnetilsynBehov,
    },
    {
      id: EHvaSituasjon.barnSykdomIkkeVarig,
      svar_tekst: hentTekst('nySituasjon.svar.barnSykdomIkkeVarig', intl),
      dokumentasjonsbehov: DokumentasjonsConfig.DokumentasjonSyktBarn,
    },
  ],
});

export const harInntektSpm = (intl: LokalIntlShape): ISpørsmål => ({
  søknadid: ENySituasjon.harInntekt,
  tekstid: 'nySituasjon.spm.harInntekt',
  flersvar: true,
  svaralternativer: [
    {
      id: EHarInntekt.arbeidstaker,
      svar_tekst: hentTekst('nySituasjon.svar.arbeidstaker', intl),
    },
    {
      id: EHarInntekt.selvstendigNæringsdrivende,
      svar_tekst: hentTekst('nySituasjon.svar.selvstendigNæringsdrivende', intl),
    },
    {
      id: EHarInntekt.annenStønadNav,
      svar_tekst: hentTekst('nySituasjon.svar.annenStønadNav', intl),
    },
    {
      id: EHarInntekt.nei,
      svar_tekst: hentTekst('svar.nei', intl),
    },
  ],
});
