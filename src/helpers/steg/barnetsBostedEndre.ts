import { erGyldigDato } from '../../utils/dato';
import { IBarn } from '../../models/steg/barn';
import {
  EBorAnnenForelderISammeHus,
  TypeBarn,
} from '../../models/steg/barnasbosted';
import { IForelder } from '../../models/steg/forelder';
import { harValgtSvar } from '../../utils/spørsmålogsvar';
import { IDatoFelt, ITekstFelt } from '../../models/søknad/søknadsfelter';
import {
  stringErNullEllerTom,
  stringHarVerdiOgErIkkeTom,
} from '../../utils/typer';
import { identErGyldig } from '../../utils/validering/validering';

export const erIdentUtfyltOgGyldig = (ident?: string): boolean =>
  !!ident && identErGyldig(ident);

export const erFødselsdatoUtfyltOgGyldigEllerTomtFelt = (
  fødselsdato?: string
) => erGyldigDato(fødselsdato) || stringErNullEllerTom(fødselsdato);

export const finnTypeBarnForMedForelder = (
  barn: IBarn,
  forelderidenterMedBarn: Map<string, IBarn[]>
) => {
  const alleBarnMedBarnetsForeldre = barn.forelder?.ident?.verdi
    ? forelderidenterMedBarn.get(barn.forelder?.ident?.verdi)
    : [];

  const harBarnetsMedforelderFlereBarn =
    !!alleBarnMedBarnetsForeldre && alleBarnMedBarnetsForeldre.length > 1;

  return harBarnetsMedforelderFlereBarn
    ? alleBarnMedBarnetsForeldre?.findIndex((b) => b.id === barn.id) === 0
      ? TypeBarn.BARN_MED_OPPRINNELIG_FORELDERINFORMASJON
      : TypeBarn.BARN_MED_KOPIERT_FORELDERINFORMASJON
    : TypeBarn.BARN_UTEN_FELLES_FORELDERINFORMASJON;
};

export const finnFørsteBarnTilHverForelder = (
  barneListe: IBarn[],
  barn: IBarn
) => {
  const andreBarnMedForelder: IBarn[] = barneListe.filter((b) => {
    return b !== barn && b.forelder;
  });
  const unikeForeldreIDer = Array.from(
    new Set(andreBarnMedForelder.map((b) => b.medforelder?.verdi?.ident))
  );

  return unikeForeldreIDer
    .map((ident) => {
      if (!ident) return null;
      return andreBarnMedForelder.find(
        (b) => b.medforelder?.verdi?.ident === ident
      );
    })
    .filter(Boolean) as IBarn[];
};

export const barnUtenForelderFraPDLOgIngenAndreForeldreDetKanKopieresFra = (
  barn: IBarn,
  førsteBarnTilHverForelder: IBarn[]
) => {
  return !barn.medforelder?.verdi && førsteBarnTilHverForelder.length === 0;
};

export const harManueltUtfyltMedforelderFraForrigeSøknadUtenForelderRegisterdata =
  (barn: IBarn, barnHarSammeForelder: boolean | undefined) => {
    return (
      !barn.medforelder?.verdi &&
      !barnHarSammeForelder &&
      barn.erFraForrigeSøknad &&
      stringHarVerdiOgErIkkeTom(barn.forelder?.navn?.label)
    );
  };

export const erAnnenForelderValgt = (annenForelderId: string | undefined) => {
  return annenForelderId && annenForelderId === 'annen-forelder';
};

export const barnUtenForelderFraPdlOgErIkkeKopiert = (
  førsteBarnTilHverForelder: IBarn[],
  barnHarSammeForelder: boolean | undefined,
  barn: IBarn
) => {
  return (
    førsteBarnTilHverForelder.length > 0 &&
    barnHarSammeForelder !== true &&
    !barn.medforelder?.verdi &&
    erAnnenForelderValgt(barn.annenForelderId)
  );
};

export const nyttBarnISøknadUtenSammeForelderOgUtfyltBarnetsBosted = (
  barn: IBarn,
  barnHarSammeForelder: boolean | undefined,
  forelder: IForelder
) => {
  return (
    barn.erFraForrigeSøknad === false &&
    barnHarSammeForelder !== true &&
    (barn.harSammeAdresse.verdi ||
      harValgtSvar(forelder.skalBarnetBoHosSøker?.verdi)) &&
    erAnnenForelderValgt(barn.annenForelderId)
  );
};

export const skalAnnenForelderRedigeres = (
  barn: IBarn,
  førsteBarnTilHverForelder: IBarn[],
  barnHarSammeForelder: boolean | undefined,
  forelder: IForelder,
  finnesBarnSomSkalHaBarnepassOgRegistrertAnnenForelderBlantValgteBarn: boolean
) => {
  return (
    harManueltUtfyltMedforelderFraForrigeSøknadUtenForelderRegisterdata(
      barn,
      barnHarSammeForelder
    ) ||
    barnUtenForelderFraPDLOgIngenAndreForeldreDetKanKopieresFra(
      barn,
      førsteBarnTilHverForelder
    ) ||
    erAnnenForelderValgt(barn.annenForelderId) ||
    barnUtenForelderFraPdlOgErIkkeKopiert(
      førsteBarnTilHverForelder,
      barnHarSammeForelder,
      barn
    ) ||
    nyttBarnISøknadUtenSammeForelderOgUtfyltBarnetsBosted(
      barn,
      barnHarSammeForelder,
      forelder
    ) ||
    (finnesBarnSomSkalHaBarnepassOgRegistrertAnnenForelderBlantValgteBarn ===
      false &&
      !barn.medforelder?.verdi) ||
    (barn.erFraForrigeSøknad && barn.forelder?.hvorforIkkeOppgi?.verdi)
  );
};

export const skalBorAnnenForelderINorgeVises = (
  barn: IBarn,
  typeBarn: TypeBarn,
  barnHarSammeForelder: boolean | undefined,
  forelder: IForelder,
  ident: ITekstFelt | undefined,
  fødselsdato: IDatoFelt | null | undefined,
  kjennerIkkeIdent: boolean
) => {
  return (
    (typeBarn !== TypeBarn.BARN_MED_KOPIERT_FORELDERINFORMASJON &&
      !!barn.medforelder?.verdi) ||
    (!barnHarSammeForelder &&
      !forelder.kanIkkeOppgiAnnenForelderFar?.verdi &&
      harValgtSvar(forelder?.navn?.verdi) &&
      (barn.erFraForrigeSøknad ||
        harValgtSvar(ident?.verdi || fødselsdato?.verdi) ||
        kjennerIkkeIdent))
  );
};

export const harValgtBorISammeHus = (forelder: IForelder) => {
  const { borAnnenForelderISammeHus } = forelder;
  return (
    (harValgtSvar(borAnnenForelderISammeHus?.verdi) &&
      borAnnenForelderISammeHus?.svarid !== EBorAnnenForelderISammeHus.ja) ||
    harValgtSvar(forelder.borAnnenForelderISammeHusBeskrivelse?.verdi)
  );
};
