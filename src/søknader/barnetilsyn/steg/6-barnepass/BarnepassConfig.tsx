import { IDokumentasjon } from '../../../../models/steg/dokumentasjon';
import { ISpørsmål } from '../../../../models/felles/spørsmålogsvar';
import {
  EBarnepass,
  ETypeBarnepassOrdning,
  EÅrsakBarnepass,
} from '../../models/barnepass';
import { ESøkerFraBestemtMåned } from '../../../../models/steg/dinsituasjon/meromsituasjon';
import { DokumentasjonsConfig } from '../../../felles/DokumentasjonsConfig';
import { LokalIntlShape } from '../../../../language/typer';

// ----- DOKUMENTASJON

export const FakturaFraBarnepassordning: IDokumentasjon =
  DokumentasjonsConfig.FakturaFraBarnepassordning;
export const AvtaleMedBarnepasser: IDokumentasjon =
  DokumentasjonsConfig.AvtaleMedBarnepasser;

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
      svar_tekst: intl.formatMessage({
        id: 'barnepass.svar.trengerMerPassEnnJevnaldrede',
      }),
      alert_tekstid: 'barnepass.dokumentasjon.trengerMerPassEnnJevnaldrede',
      dokumentasjonsbehov: DokumentasjonTrengerMerPassEnnJevnaldrede,
    },
    {
      id: EÅrsakBarnepass.myeBortePgaJobb,
      svar_tekst: intl.formatMessage({ id: 'barnepass.svar.myeBortePgaJobb' }),
      alert_tekstid: 'barnepass.dokumentasjon.arbeidstid',
      dokumentasjonsbehov: DokumentasjonMyeBortePgaJobb,
    },
    {
      id: EÅrsakBarnepass.utenomVanligArbeidstid,
      svar_tekst: intl.formatMessage({
        id: 'barnepass.svar.utenomVanligArbeidstid',
      }),
      alert_tekstid: 'barnepass.dokumentasjon.arbeidstid',
      dokumentasjonsbehov: DokumentasjonUtenomVanligArbeidstid,
    },
  ],
});

export const HvaSlagsBarnepassOrdningSpm = (
  intl: LokalIntlShape
): ISpørsmål => ({
  søknadid: EBarnepass.hvaSlagsBarnepassOrdning,
  tekstid: 'barnepass.spm.hvaSlagsOrdning',
  flersvar: false,
  svaralternativer: [
    {
      id: ETypeBarnepassOrdning.barnehageOgLiknende,
      svar_tekst: intl.formatMessage({
        id: 'hvaSlagsOrdning.svar.barnehageOgLiknende',
      }),
      dokumentasjonsbehov: FakturaFraBarnepassordning,
    },
    {
      id: ETypeBarnepassOrdning.privat,
      svar_tekst: intl.formatMessage({ id: 'hvaSlagsOrdning.svar.privat' }),
      dokumentasjonsbehov: AvtaleMedBarnepasser,
    },
  ],
});

export const SøkerDuStønadFraBestemtMndSpm = (
  intl: LokalIntlShape
): ISpørsmål => ({
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
      svar_tekst: intl.formatMessage({ id: 'svar.ja' }),
    },
    {
      id: ESøkerFraBestemtMåned.neiNavKanVurdere,
      svar_tekst: intl.formatMessage({
        id: 'søkerFraBestemtMåned.svar.neiNavKanVurdere',
      }),
    },
  ],
});
