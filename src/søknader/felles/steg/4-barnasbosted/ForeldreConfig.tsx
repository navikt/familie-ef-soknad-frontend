import { ESvarTekstid, ISpørsmål } from '../../../../models/felles/spørsmålogsvar';
import {
  EBorAnnenForelderISammeHus,
  EHarSamværMedBarn,
  EHarSkriftligSamværsavtale,
  EHvorforIkkeOppgi,
  EHvorMyeSammen,
  ESkalBarnetBoHosSøker,
} from '../../../../models/steg/barnasbosted';
import { IDokumentasjon } from '../../../../models/steg/dokumentasjon';
import { IBarn } from '../../../../models/steg/barn';
import { EForelder } from '../../../../models/steg/forelder';
import { JaNeiSvar } from '../../../../helpers/svar';
import { DokumentasjonsConfig } from '../../DokumentasjonsConfig';
import { LokalIntlShape } from '../../../../language/typer';
import { hentTekst } from '../../../../utils/teksthåndtering';

// --- Dokumentasjon

const DokumentasjonBarnBorHosDeg: IDokumentasjon = DokumentasjonsConfig.DokumentasjonBarnBorHosDeg;

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
      svar_tekst: hentTekst('barnasbosted.spm.donorbarn', intl),
    },
    {
      id: EHvorforIkkeOppgi.annet,
      svar_tekst: hentTekst('barnasbosted.spm.annet', intl),
    },
  ],
});

export const harAnnenForelderSamværMedBarn = (intl: LokalIntlShape, barn: IBarn): ISpørsmål => ({
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
      svar_tekst: hentTekst('barnasbosted.spm.jaIkkeMerEnnVanlig', intl),
    },
    {
      id: EHarSamværMedBarn.jaMerEnnVanlig,
      svar_tekst: hentTekst('barnasbosted.spm.jaMerEnnVanlig', intl),
    },
    {
      id: EHarSamværMedBarn.nei,
      svar_tekst: barn.født?.verdi
        ? hentTekst('barnasbosted.spm.andreForelderenSamværNei', intl)
        : hentTekst('barnasbosted.spm.andreForelderenSamværNei.ufødt', intl),
    },
  ],
});

export const harDereSkriftligSamværsavtale = (intl: LokalIntlShape): ISpørsmål => ({
  søknadid: EForelder.harDereSkriftligSamværsavtale,
  tekstid: 'barnasbosted.spm.harDereSkriftligSamværsavtale',
  flersvar: false,
  lesmer: {
    innholdTekstid: 'barnasbosted.hjelpetekst-innhold.harDereSkriftligSamværsavtale',
    headerTekstid: 'barnasbosted.hjelpetekst-åpne.harDereSkriftligSamværsavtale',
  },
  svaralternativer: [
    {
      id: EHarSkriftligSamværsavtale.jaKonkreteTidspunkter,
      svar_tekst: hentTekst('barnasbosted.spm.jaKonkreteTidspunkt', intl),
      dokumentasjonsbehov: SamværsavtaleMedKonkreteTidspunkter,
    },
    {
      id: EHarSkriftligSamværsavtale.jaIkkeKonkreteTidspunkter,
      svar_tekst: hentTekst('barnasbosted.spm.jaIkkeKonkreteTidspunkt', intl),
      dokumentasjonsbehov: SamværsavtaleUtenKonkreteTidspunkter,
    },
    {
      id: EHarSkriftligSamværsavtale.nei,
      svar_tekst: hentTekst(ESvarTekstid.NEI, intl),
    },
  ],
});

export const borAnnenForelderISammeHus = (intl: LokalIntlShape): ISpørsmål => ({
  søknadid: 'borAnnenForelderISammeHus',
  tekstid: 'barnasbosted.spm.borAnnenForelderISammeHus',
  lesmer: {
    headerTekstid: 'barnasbosted.hjelpetekst.borAnnenForelderISammeHus.apne',
    innholdTekstid: 'barnasbosted.hjelpetekst.borAnnenForelderISammeHus.innhold',
  },
  flersvar: false,
  svaralternativer: [
    {
      id: EBorAnnenForelderISammeHus.ja,
      svar_tekst: hentTekst(ESvarTekstid.JA, intl),
    },
    {
      id: EBorAnnenForelderISammeHus.nei,
      svar_tekst: hentTekst(ESvarTekstid.NEI, intl),
    },
    {
      id: EBorAnnenForelderISammeHus.vetikke,
      svar_tekst: hentTekst('barnasbosted.spm.vetikke', intl),
    },
  ],
});

export const hvorMyeSammen = (intl: LokalIntlShape, barn: IBarn): ISpørsmål => ({
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
      svar_tekst: hentTekst('barnasbosted.spm.møtesIkke', intl),
    },
    {
      id: EHvorMyeSammen.kunNårLeveres,
      svar_tekst: barn.født?.verdi
        ? hentTekst('barnasbosted.spm.kunNårLeveres', intl)
        : hentTekst('barnasbosted.spm.kunNårLeveres.ufødt', intl),
    },
    {
      id: EHvorMyeSammen.møtesUtenom,
      svar_tekst: barn.født?.verdi
        ? hentTekst('barnasbosted.spm.møtesUtenom', intl)
        : hentTekst('barnasbosted.spm.møtesUtenom.ufødt', intl),
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
      svar_tekst: hentTekst('barnasbosted.spm.jaFolkeregistrert', intl),
    },
    {
      id: ESkalBarnetBoHosSøker.jaMenSamarbeiderIkke,
      svar_tekst: hentTekst('barnasbosted.spm.jaMenSamarbeiderIkke', intl),
      dokumentasjonsbehov: DokumentasjonBarnBorHosDeg,
    },
    {
      id: ESkalBarnetBoHosSøker.neiMenAvtaleDeltBosted,
      svar_tekst: hentTekst('barnasbosted.spm.neiMenAvtaleDeltBosted', intl),
    },
    {
      id: ESkalBarnetBoHosSøker.nei,
      svar_tekst: hentTekst(ESvarTekstid.NEI, intl),
    },
  ],
});
