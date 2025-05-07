import { ESvarTekstid, ISpørsmål } from '../../../models/felles/spørsmålogsvar';
import {
  EBorAnnenForelderISammeHus,
  EHarSamværMedBarn,
  EHarSkriftligSamværsavtale,
  EHvorforIkkeOppgi,
  EHvorMyeSammen,
  ESkalBarnetBoHosSøker,
} from '../../../models/steg/barnasbosted';
import { IDokumentasjon } from '../../../models/steg/dokumentasjon';
import { IBarn } from '../../../models/steg/barn';
import { EForelder } from '../../../models/steg/forelder';
import { JaNeiSvar } from '../../../helpers/svar';
import { DokumentasjonsConfig } from '../../DokumentasjonsConfig';
import { LokalIntlShape } from '../../../language/typer';

// --- Dokumentasjon

const DokumentasjonBarnBorHosDeg: IDokumentasjon =
  DokumentasjonsConfig.DokumentasjonBarnBorHosDeg;

const SamværsavtaleMedKonkreteTidspunkter: IDokumentasjon =
  DokumentasjonsConfig.SamværsavtaleMedKonkreteTidspunkter;

const SamværsavtaleUtenKonkreteTidspunkter: IDokumentasjon =
  DokumentasjonsConfig.SamværsavtaleUtenKonkreteTidspunkter;
// --- Spørsmål

export const borINorge = (intl: LokalIntlShape): ISpørsmål => ({
  søknadid: EForelder.borINorge,
  tekstid: 'barnasbosted.borinorge',
  flersvar: false,
  svaralternativer: JaNeiSvar(intl),
});

export const boddSammenFør = (intl: LokalIntlShape): ISpørsmål => ({
  søknadid: 'boddSammenFør',
  tekstid: 'barnasbosted.spm.boddsammenfør',
  flersvar: false,
  svaralternativer: JaNeiSvar(intl),
});

export const hvorforIkkeOppgi = (intl: LokalIntlShape): ISpørsmål => ({
  søknadid: EForelder.hvorforIkkeOppgi,
  tekstid: 'barnasbosted.spm.hvorforikkeoppgi',
  flersvar: false,
  svaralternativer: [
    {
      id: EHvorforIkkeOppgi.donorbarn,
      svar_tekst: intl.formatMessage({ id: 'barnasbosted.spm.donorbarn' }),
    },
    {
      id: EHvorforIkkeOppgi.annet,
      svar_tekst: intl.formatMessage({ id: 'barnasbosted.spm.annet' }),
    },
  ],
});

export const harAnnenForelderSamværMedBarn = (
  intl: LokalIntlShape,
  barn: IBarn
): ISpørsmål => ({
  søknadid: EForelder.harAnnenForelderSamværMedBarn,
  tekstid: barn.født?.verdi
    ? 'barnasbosted.spm.harAnnenForelderSamværMedBarn'
    : 'barnasbosted.spm.harAnnenForelderSamværMedBarn.ufødt',
  flersvar: false,
  lesmer: {
    headerTekstid: '',
    innholdTekstid: 'barnasbosted.hjelpetekst.samvær.innhold',
  },
  svaralternativer: [
    {
      id: EHarSamværMedBarn.jaIkkeMerEnnVanlig,
      svar_tekst: intl.formatMessage({
        id: 'barnasbosted.spm.jaIkkeMerEnnVanlig',
      }),
    },
    {
      id: EHarSamværMedBarn.jaMerEnnVanlig,
      svar_tekst: intl.formatMessage({ id: 'barnasbosted.spm.jaMerEnnVanlig' }),
    },
    {
      id: EHarSamværMedBarn.nei,
      svar_tekst: intl.formatMessage({
        id: barn.født?.verdi
          ? 'barnasbosted.spm.andreForelderenSamværNei'
          : 'barnasbosted.spm.andreForelderenSamværNei.ufødt',
      }),
    },
  ],
});

export const harDereSkriftligSamværsavtale = (
  intl: LokalIntlShape
): ISpørsmål => ({
  søknadid: EForelder.harDereSkriftligSamværsavtale,
  tekstid: 'barnasbosted.spm.harDereSkriftligSamværsavtale',
  flersvar: false,
  lesmer: {
    innholdTekstid:
      'barnasbosted.hjelpetekst-innhold.harDereSkriftligSamværsavtale',
    headerTekstid:
      'barnasbosted.hjelpetekst-åpne.harDereSkriftligSamværsavtale',
  },
  svaralternativer: [
    {
      id: EHarSkriftligSamværsavtale.jaKonkreteTidspunkter,
      svar_tekst: intl.formatMessage({
        id: 'barnasbosted.spm.jaKonkreteTidspunkt',
      }),
      dokumentasjonsbehov: SamværsavtaleMedKonkreteTidspunkter,
    },
    {
      id: EHarSkriftligSamværsavtale.jaIkkeKonkreteTidspunkter,
      svar_tekst: intl.formatMessage({
        id: 'barnasbosted.spm.jaIkkeKonkreteTidspunkt',
      }),
      dokumentasjonsbehov: SamværsavtaleUtenKonkreteTidspunkter,
    },
    {
      id: EHarSkriftligSamværsavtale.nei,
      svar_tekst: intl.formatMessage({ id: ESvarTekstid.NEI }),
    },
  ],
});

export const borAnnenForelderISammeHus = (intl: LokalIntlShape): ISpørsmål => ({
  søknadid: 'borAnnenForelderISammeHus',
  tekstid: 'barnasbosted.spm.borAnnenForelderISammeHus',
  lesmer: {
    headerTekstid: 'barnasbosted.hjelpetekst.borAnnenForelderISammeHus.apne',
    innholdTekstid:
      'barnasbosted.hjelpetekst.borAnnenForelderISammeHus.innhold',
  },
  flersvar: false,
  svaralternativer: [
    {
      id: EBorAnnenForelderISammeHus.ja,
      svar_tekst: intl.formatMessage({ id: ESvarTekstid.JA }),
    },
    {
      id: EBorAnnenForelderISammeHus.nei,
      svar_tekst: intl.formatMessage({ id: ESvarTekstid.NEI }),
    },
    {
      id: EBorAnnenForelderISammeHus.vetikke,
      svar_tekst: intl.formatMessage({ id: 'barnasbosted.spm.vetikke' }),
    },
  ],
});

export const hvorMyeSammen = (
  intl: LokalIntlShape,
  barn: IBarn
): ISpørsmål => ({
  søknadid: 'hvorMyeSammen',
  tekstid: 'barnasbosted.spm.hvorMyeSammen',
  flersvar: false,
  lesmer: {
    headerTekstid: 'barnasbosted.lesmer-åpne.hvorMyeSammen',
    innholdTekstid: 'barnasbosted.lesmer-innhold.hvorMyeSammen',
  },
  svaralternativer: [
    {
      id: EHvorMyeSammen.møtesIkke,
      svar_tekst: intl.formatMessage({ id: 'barnasbosted.spm.møtesIkke' }),
    },
    {
      id: EHvorMyeSammen.kunNårLeveres,
      svar_tekst: barn.født?.verdi
        ? intl.formatMessage({ id: 'barnasbosted.spm.kunNårLeveres' })
        : intl.formatMessage({ id: 'barnasbosted.spm.kunNårLeveres.ufødt' }),
    },
    {
      id: EHvorMyeSammen.møtesUtenom,
      svar_tekst: barn.født?.verdi
        ? intl.formatMessage({ id: 'barnasbosted.spm.møtesUtenom' })
        : intl.formatMessage({ id: 'barnasbosted.spm.møtesUtenom.ufødt' }),
    },
  ],
});

export const skalBarnetBoHosSøker = (intl: LokalIntlShape): ISpørsmål => ({
  søknadid: EForelder.skalBarnetBoHosSøker,
  tekstid: 'barnasbosted.spm.skalBarnetBoHosSøker',
  flersvar: false,
  svaralternativer: [
    {
      id: ESkalBarnetBoHosSøker.ja,
      svar_tekst: intl.formatMessage({
        id: 'barnasbosted.spm.jaFolkeregistrert',
      }),
    },
    {
      id: ESkalBarnetBoHosSøker.jaMenSamarbeiderIkke,
      svar_tekst: intl.formatMessage({
        id: 'barnasbosted.spm.jaMenSamarbeiderIkke',
      }),
      dokumentasjonsbehov: DokumentasjonBarnBorHosDeg,
    },
    {
      id: ESkalBarnetBoHosSøker.neiMenAvtaleDeltBosted,
      svar_tekst: intl.formatMessage({
        id: 'barnasbosted.spm.neiMenAvtaleDeltBosted',
      }),
    },
    {
      id: ESkalBarnetBoHosSøker.nei,
      svar_tekst: intl.formatMessage({ id: ESvarTekstid.NEI }),
    },
  ],
});
