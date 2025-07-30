import { IDokumentasjon } from '../../../../models/steg/dokumentasjon';
import { ISpørsmål } from '../../../../models/felles/spørsmålogsvar';
import { EBarnepass, ETypeBarnepassOrdning, EÅrsakBarnepass } from '../../models/barnepass';
import { ESøkerFraBestemtMåned } from '../../../../models/steg/dinsituasjon/meromsituasjon';
import { DokumentasjonsConfig } from '../../../felles/DokumentasjonsConfig';
import { LokalIntlShape } from '../../../../language/typer';
import { hentTekst } from '../../../../utils/teksthåndtering';

// ----- DOKUMENTASJON

export const FakturaFraBarnepassordning: IDokumentasjon =
  DokumentasjonsConfig.FakturaFraBarnepassordning;
export const AvtaleMedBarnepasser: IDokumentasjon = DokumentasjonsConfig.AvtaleMedBarnepasser;

export const DokumentasjonTrengerMerPassEnnJevnaldrede: IDokumentasjon =
  DokumentasjonsConfig.DokumentasjonTrengerMerPassEnnJevnaldrede;
export const DokumentasjonUtenomVanligArbeidstid: IDokumentasjon =
  DokumentasjonsConfig.DokumentasjonUtenomVanligArbeidstid;
export const DokumentasjonMyeBortePgaJobb: IDokumentasjon =
  DokumentasjonsConfig.DokumentasjonMyeBortePgaJobb;

// --- SPØRSMÅL

export const årsakBarnepass = (intl: LokalIntlShape): ISpørsmål => ({
  søknadid: EBarnepass.årsakBarnepass,
  tekstid: 'barnepass.spm.årsak',
  flersvar: false,
  svaralternativer: [
    {
      id: EÅrsakBarnepass.trengerMerPassEnnJevnaldrede,
      svar_tekst: hentTekst('barnepass.svar.trengerMerPassEnnJevnaldrede', intl),
      alert_tekstid: 'barnepass.dokumentasjon.trengerMerPassEnnJevnaldrede',
      dokumentasjonsbehov: DokumentasjonTrengerMerPassEnnJevnaldrede,
    },
    {
      id: EÅrsakBarnepass.myeBortePgaJobb,
      svar_tekst: hentTekst('barnepass.svar.myeBortePgaJobb', intl),
      alert_tekstid: 'barnepass.dokumentasjon.arbeidstid',
      dokumentasjonsbehov: DokumentasjonMyeBortePgaJobb,
    },
    {
      id: EÅrsakBarnepass.utenomVanligArbeidstid,
      svar_tekst: hentTekst('barnepass.svar.utenomVanligArbeidstid', intl),
      alert_tekstid: 'barnepass.dokumentasjon.arbeidstid',
      dokumentasjonsbehov: DokumentasjonUtenomVanligArbeidstid,
    },
  ],
});

export const HvaSlagsBarnepassOrdningSpm = (intl: LokalIntlShape): ISpørsmål => ({
  søknadid: EBarnepass.hvaSlagsBarnepassOrdning,
  tekstid: 'barnepass.spm.hvaSlagsOrdning',
  flersvar: false,
  svaralternativer: [
    {
      id: ETypeBarnepassOrdning.barnehageOgLiknende,
      svar_tekst: hentTekst('hvaSlagsOrdning.svar.barnehageOgLiknende', intl),
      dokumentasjonsbehov: FakturaFraBarnepassordning,
    },
    {
      id: ETypeBarnepassOrdning.privat,
      svar_tekst: hentTekst('hvaSlagsOrdning.svar.privat', intl),
      dokumentasjonsbehov: AvtaleMedBarnepasser,
    },
  ],
});

export const SøkerDuStønadFraBestemtMndSpm = (intl: LokalIntlShape): ISpørsmål => ({
  søknadid: EBarnepass.søkerFraBestemtMåned,
  tekstid: 'søkerFraBestemtMåned.spm.barnepass',
  flersvar: false,
  lesmer: {
    headerTekstid: '',
    innholdTekstid: 'søkerFraBestemtMåned.hjelpetekst-innhold.barnepass',
  },
  svaralternativer: [
    {
      id: ESøkerFraBestemtMåned.ja,
      svar_tekst: hentTekst('svar.ja', intl),
    },
    {
      id: ESøkerFraBestemtMåned.neiNavKanVurdere,
      svar_tekst: hentTekst('søkerFraBestemtMåned.svar.neiNavKanVurdere', intl),
    },
  ],
});
