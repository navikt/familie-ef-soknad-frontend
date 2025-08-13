import {
  EBorAnnenForelderISammeHus,
  EHarSamværMedBarn,
  EHarSkriftligSamværsavtale,
  EHvorforIkkeOppgi,
  EHvorMyeSammen,
} from '../../models/steg/barnasbosted';
import { EForelder, IForelder } from '../../models/steg/forelder';
import { ISpørsmål, ISvar } from '../../models/felles/spørsmålogsvar';
import { harValgtSvar } from '../../utils/spørsmålogsvar';
import { erDatoGyldigOgInnenforBegrensning } from '../../components/dato/gyldigeDatoerUtils';
import { GyldigeDatoer } from '../../components/dato/Datovelger';
import {
  erFødselsdatoUtfyltOgGyldigEllerTomtFelt,
  erIdentUtfyltOgGyldig,
  harValgtBorISammeHus,
} from './barnetsBostedEndre';
import { stringErNullEllerTom, stringHarVerdiOgErIkkeTom } from '../../utils/typer';
import { erGyldigDato } from '../../utils/dato';
import { IBooleanFelt } from '../../models/søknad/søknadsfelter';

export const utfyltBorINorge = (forelder: IForelder) => {
  const { borINorge, land } = forelder;
  return (
    borINorge?.verdi === true ||
    (borINorge?.verdi === false && stringHarVerdiOgErIkkeTom(land?.verdi))
  );
};

export const erForelderUtfylt = (
  harSammeAdresse: IBooleanFelt,
  forelder?: IForelder,
  harForelderFraPdl?: boolean
): boolean | undefined => {
  if (forelder === undefined) return false;

  const forelderInfoOgSpørsmålBesvart: boolean | undefined =
    utfyltNavnOgIdent(forelder, harForelderFraPdl) &&
    utfyltSkalBarnetBoHosSøker(forelder, harSammeAdresse) &&
    utfyltBorINorge(forelder) &&
    utfyltNødvendigeSamværSpørsmål(forelder) &&
    utfyltNødvendigBostedSpørsmål(forelder) &&
    harValgtBorISammeHus(forelder) &&
    visSpørsmålHvisIkkeSammeForelder(forelder) &&
    utfyltBoddSammenAnnenForelder(forelder);

  const kanIkkeOppgiAnnenForelderRuteUtfylt =
    utfyltNødvendigSpørsmålUtenOppgiAnnenForelder(forelder);

  return forelderInfoOgSpørsmålBesvart || kanIkkeOppgiAnnenForelderRuteUtfylt;
};

export const utfyltSkalBarnetBoHosSøker = (forelder: IForelder, harSammeAdresse: IBooleanFelt) => {
  return harSammeAdresse.verdi || harValgtSvar(forelder.skalBarnetBoHosSøker?.verdi);
};

export const utfyltNavnOgIdent = (forelder: IForelder, harForelderFraPdl: boolean | undefined) => {
  const kjennerIkkeIdent =
    stringHarVerdiOgErIkkeTom(forelder.navn?.verdi) && stringErNullEllerTom(forelder.ident?.verdi);

  return (
    (stringHarVerdiOgErIkkeTom(forelder.navn) &&
      (erIdentUtfyltOgGyldig(forelder.ident?.verdi) ||
        (erFødselsdatoUtfyltOgGyldigEllerTomtFelt(forelder?.fødselsdato?.verdi) &&
          kjennerIkkeIdent))) ||
    harForelderFraPdl
  );
};

export const utfyltBoddSammenAnnenForelder = (forelder: IForelder) => {
  return (
    forelder.boddSammenFør &&
    ((forelder.boddSammenFør.verdi && erGyldigDato(forelder.flyttetFra?.verdi)) ||
      forelder.boddSammenFør?.verdi === false)
  );
};

export const erIkkeOppgittPgaAnnet = (forelder: IForelder) => {
  return forelder.hvorforIkkeOppgi?.svarid === EHvorforIkkeOppgi.annet;
};

export const utfyltNødvendigSpørsmålUtenOppgiAnnenForelder = (forelder: IForelder) => {
  const { hvorforIkkeOppgi, ikkeOppgittAnnenForelderBegrunnelse, kanIkkeOppgiAnnenForelderFar } =
    forelder;

  const pgaDonorBarn = hvorforIkkeOppgi?.svarid === EHvorforIkkeOppgi.donorbarn;
  const pgaAnnet =
    erIkkeOppgittPgaAnnet(forelder) &&
    harValgtSvar(forelder?.ikkeOppgittAnnenForelderBegrunnelse?.verdi) &&
    ikkeOppgittAnnenForelderBegrunnelse?.verdi !== hvorforIkkeOppgi?.verdi;

  return kanIkkeOppgiAnnenForelderFar?.verdi && (pgaDonorBarn || pgaAnnet);
};

export const utfyltNødvendigeSamværSpørsmål = (forelder?: IForelder) => {
  if (!forelder) return;
  const {
    harAnnenForelderSamværMedBarn,
    harDereSkriftligSamværsavtale,
    hvordanPraktiseresSamværet,
  } = forelder;

  if (harForelderSamværMedBarn(harAnnenForelderSamværMedBarn?.svarid))
    return harValgtSvar(harAnnenForelderSamværMedBarn?.verdi);
  else if (
    måBeskriveSamværet(harDereSkriftligSamværsavtale?.svarid, harAnnenForelderSamværMedBarn?.svarid)
  )
    return harValgtSvar(hvordanPraktiseresSamværet?.verdi);
  else return true;
};

export const utfyltNødvendigBostedSpørsmål = (forelder: IForelder) => {
  const utfyltBorISammeHus =
    forelder?.borINorge?.verdi &&
    forelder?.borAnnenForelderISammeHus?.svarid === EBorAnnenForelderISammeHus.ja
      ? forelder?.borAnnenForelderISammeHusBeskrivelse?.verdi !== ''
      : true;

  const harFlyttetFraDato: boolean =
    forelder?.flyttetFra?.verdi &&
    erDatoGyldigOgInnenforBegrensning(forelder.flyttetFra?.verdi, GyldigeDatoer.alle)
      ? true
      : false;

  const utfyltBoddSammenFør =
    forelder?.boddSammenFør?.verdi === true
      ? harValgtSvar(forelder?.boddSammenFør?.verdi) && harFlyttetFraDato
      : harValgtSvar(forelder?.boddSammenFør?.verdi);

  const utfyltHvorMyeSammen =
    forelder?.hvorMyeSammen?.svarid === EHvorMyeSammen.møtesUtenom
      ? harValgtSvar(forelder.beskrivSamværUtenBarn?.verdi)
      : harValgtSvar(forelder?.hvorMyeSammen?.verdi);

  return utfyltBorISammeHus && utfyltBoddSammenFør && utfyltHvorMyeSammen;
};

export const harForelderSamværMedBarn = (svarid: string | undefined) => {
  switch (svarid) {
    case EHarSamværMedBarn.jaIkkeMerEnnVanlig:
      return true;
    case EHarSamværMedBarn.jaMerEnnVanlig:
      return true;
    case EHarSamværMedBarn.nei:
      return false;

    default:
      return false;
  }
};

export const harSkriftligSamværsavtale = (svarid: string | undefined) => {
  switch (svarid) {
    case EHarSkriftligSamværsavtale.jaKonkreteTidspunkter:
      return false;
    case EHarSkriftligSamværsavtale.jaIkkeKonkreteTidspunkter:
      return true;
    case EHarSkriftligSamværsavtale.nei:
      return true;

    default:
      return false;
  }
};

export const måBeskriveSamværet = (
  samværsavtale: string | undefined,
  samværMedBarn: string | undefined
) => {
  return (
    samværMedBarn === EHarSamværMedBarn.jaMerEnnVanlig &&
    (samværsavtale === EHarSkriftligSamværsavtale.jaIkkeKonkreteTidspunkter ||
      samværsavtale === EHarSkriftligSamværsavtale.nei)
  );
};

export const visSpørsmålHvisIkkeSammeForelder = (forelder: IForelder) => {
  if (forelder.harAnnenForelderSamværMedBarn?.svarid === EHarSamværMedBarn.nei) return true;
  else if (forelder.hvordanPraktiseresSamværet && forelder.hvordanPraktiseresSamværet?.verdi !== '')
    return true;
  else if (forelder.harDereSkriftligSamværsavtale?.svarid)
    return !måBeskriveSamværet(
      forelder.harDereSkriftligSamværsavtale.svarid,
      forelder.harAnnenForelderSamværMedBarn?.svarid
    );

  return false;
};

export const hvisEndretSvarSlettFeltHvordanPraktiseresSamværet = (
  spørsmål: ISpørsmål,
  svar: ISvar
) => {
  return (
    (spørsmål.søknadid === EForelder.harDereSkriftligSamværsavtale &&
      svar.id === EHarSkriftligSamværsavtale.nei) ||
    (spørsmål.søknadid === EForelder.harAnnenForelderSamværMedBarn &&
      svar.id === EHarSamværMedBarn.nei)
  );
};

export const slettIrrelevantPropertiesHvisHuketAvKanIkkeOppgiAnnenForelder = (
  nyForelder: IForelder
) => {
  delete nyForelder.navn;
  delete nyForelder.fødselsdato;
  delete nyForelder.ident;
  delete nyForelder.id;
  delete nyForelder.borAnnenForelderISammeHus;
  delete nyForelder.borAnnenForelderISammeHusBeskrivelse;
  delete nyForelder.harAnnenForelderSamværMedBarn;
  delete nyForelder.borINorge;
  delete nyForelder.land;
  delete nyForelder.boddSammenFør;
  delete nyForelder.flyttetFra;
  delete nyForelder.hvorMyeSammen;
  delete nyForelder.beskrivSamværUtenBarn;
  delete nyForelder.harDereSkriftligSamværsavtale;
};

export const resetForelder = (forelder: IForelder) => {
  delete forelder.id;
  delete forelder.navn;
  delete forelder.skalBarnetBoHosSøker;
  delete forelder.fødselsdato;
  delete forelder.ident;
  delete forelder.kanIkkeOppgiAnnenForelderFar;
  delete forelder.hvorforIkkeOppgi;
  delete forelder.ikkeOppgittAnnenForelderBegrunnelse;
  delete forelder.borINorge;
  delete forelder.land;
  delete forelder.harAnnenForelderSamværMedBarn;
  delete forelder.harDereSkriftligSamværsavtale;
  delete forelder.hvordanPraktiseresSamværet;
  delete forelder.borAnnenForelderISammeHus;
  delete forelder.borAnnenForelderISammeHusBeskrivelse;
  delete forelder.boddSammenFør;
  delete forelder.flyttetFra;
  delete forelder.hvorMyeSammen;
  delete forelder.beskrivSamværUtenBarn;
};
