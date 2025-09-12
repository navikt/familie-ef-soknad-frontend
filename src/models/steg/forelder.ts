import {
  IBooleanFelt,
  IDatoFelt,
  ISpørsmålBooleanFelt,
  ISpørsmålFelt,
  ITekstFelt,
} from '../søknad/søknadsfelter';

export interface IForelder {
  id?: string;
  navn?: ITekstFelt;
  skalBarnetBoHosSøker?: ISpørsmålFelt;
  fødselsdato?: IDatoFelt | null;
  ident?: ITekstFelt;
  kanIkkeOppgiAnnenForelderFar?: IBooleanFelt;
  hvorforIkkeOppgi?: ISpørsmålFelt;
  ikkeOppgittAnnenForelderBegrunnelse?: ITekstFelt;
  borINorge?: ISpørsmålBooleanFelt;
  land?: ISpørsmålFelt;
  harAnnenForelderSamværMedBarn?: ISpørsmålFelt;
  harDereSkriftligSamværsavtale?: ISpørsmålFelt;
  hvordanPraktiseresSamværet?: ITekstFelt;
  borAnnenForelderISammeHus?: ISpørsmålFelt;
  borAnnenForelderISammeHusBeskrivelse?: ITekstFelt;
  boddSammenFør?: ISpørsmålBooleanFelt;
  flyttetFra?: IDatoFelt;
  hvorMyeSammen?: ISpørsmålFelt;
  beskrivSamværUtenBarn?: ITekstFelt;
  fraFolkeregister?: boolean;
  erKopiertFraAnnetBarn?: boolean;
}

export enum EForelder {
  skalBarnetBoHosSøker = 'skalBarnetBoHosSøker',
  borINorge = 'borINorge',
  hvorforIkkeOppgi = 'hvorforIkkeOppgi',

  harAnnenForelderSamværMedBarn = 'harAnnenForelderSamværMedBarn',
  harDereSkriftligSamværsavtale = 'harDereSkriftligSamværsavtale',
  hvordanPraktiseresSamværet = 'hvordanPraktiseresSamværet',
  borAnnenForelderISammeHus = 'borAnnenForelderISammeHus',
  borAnnenForelderISammeHusBeskrivelse = 'borAnnenForelderISammeHusBeskrivelse',
  boddSammenFør = 'boddSammenFør',
  flyttetFra = 'flyttetFra',
  hvorMyeSammen = 'hvorMyeSammen',
  beskrivSamværUtenBarn = 'beskrivSamværUtenBarn',
}
