import {
  EHarSamværMedBarn,
  EHarSkriftligSamværsavtale,
  EHvorforIkkeOppgi,
  EHvorMyeSammen,
} from '../../models/steg/barnasbosted';
import { EForelder, IForelder } from '../../models/steg/forelder';
import { ESvar, ISpørsmål, ISvar } from '../../models/felles/spørsmålogsvar';
import { harValgtSvar } from '../../utils/spørsmålogsvar';
import { erGyldigDato } from '../../utils/dato';

export const visBostedOgSamværSeksjon = (
  forelder: IForelder,
  visesBorINorgeSpørsmål: boolean
) => {
  const borForelderINorgeSpm =
    forelder.borINorge?.svarid === ESvar.JA ||
    (forelder.land && forelder.land?.verdi !== '');

  return visesBorINorgeSpørsmål
    ? borForelderINorgeSpm
    : erGyldigDato(forelder.fødselsdato?.verdi);
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
  if (forelder.harAnnenForelderSamværMedBarn?.svarid === EHarSamværMedBarn.nei)
    return true;
  else if (
    forelder.hvordanPraktiseresSamværet &&
    forelder.hvordanPraktiseresSamværet?.verdi !== ''
  )
    return true;
  else if (forelder.avtaleOmDeltBosted?.svarid === ESvar.JA) return true;
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

export const harSkriftligAvtaleOmDeltBosted = (
  spørsmål: ISpørsmål,
  svar: ISvar
) => {
  return (
    spørsmål.søknadid === EForelder.avtaleOmDeltBosted && svar.id === ESvar.JA
  );
};

export const erAlleFelterOgSpørsmålBesvart = (
  forelder: IForelder,
  barnHarSammeForelder: boolean | undefined
): boolean => {
  const {
    harAnnenForelderSamværMedBarn,
    harDereSkriftligSamværsavtale,
    hvordanPraktiseresSamværet,
    hvorMyeSammen,
    beskrivSamværUtenBarn,
    hvorforIkkeOppgi,
    ikkeOppgittAnnenForelderBegrunnelse,
    avtaleOmDeltBosted,
  } = forelder;

  const erDonorbarn = hvorforIkkeOppgi?.svarid === EHvorforIkkeOppgi.donorbarn;
  const erAnnetBegrunnelseUtfylt =
    harValgtSvar(ikkeOppgittAnnenForelderBegrunnelse?.verdi) &&
    ikkeOppgittAnnenForelderBegrunnelse?.verdi !== hvorforIkkeOppgi?.verdi;

  const harIkkeBeskrivendeNokSamværsavtale =
    harDereSkriftligSamværsavtale?.svarid ===
      EHarSkriftligSamværsavtale.jaIkkeKonkreteTidspunkter ||
    harDereSkriftligSamværsavtale?.svarid === EHarSkriftligSamværsavtale.nei;

  if (harValgtSvar(barnHarSammeForelder) && barnHarSammeForelder === true) {
    return (
      avtaleOmDeltBosted?.svarid === ESvar.JA ||
      harAnnenForelderSamværMedBarn?.svarid === EHarSamværMedBarn.nei ||
      harDereSkriftligSamværsavtale?.svarid ===
        EHarSkriftligSamværsavtale.jaKonkreteTidspunkter ||
      (harAnnenForelderSamværMedBarn?.svarid ===
        EHarSamværMedBarn.jaIkkeMerEnnVanlig &&
        harIkkeBeskrivendeNokSamværsavtale) ||
      harValgtSvar(hvordanPraktiseresSamværet?.verdi)
    );
  } else {
    return (
      (harValgtSvar(hvorMyeSammen?.verdi) &&
        hvorMyeSammen?.svarid !== EHvorMyeSammen.møtesUtenom) ||
      harValgtSvar(beskrivSamværUtenBarn?.verdi) ||
      erDonorbarn ||
      erAnnetBegrunnelseUtfylt
    );
  }
};
