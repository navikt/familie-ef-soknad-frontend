import { Søknad } from '../../../../models/søknad/søknad';
import { IMedlemskap } from '../../../../models/steg/omDeg/medlemskap';
import { EBegrunnelse, ISivilstatus } from '../../../../models/steg/omDeg/sivilstatus';
import { IPersonDetaljer } from '../../../../models/søknad/person';
import { ISpørsmålBooleanFelt } from '../../../../models/søknad/søknadsfelter';
import { IAdresseopplysninger } from '../../../../models/steg/adresseopplysninger';

const validerOmDeg = <T extends Søknad>(
  søknad: T,
  sivilstatus: ISivilstatus,
  medlemskap: IMedlemskap,
  harMeldtAdresseendring?: IAdresseopplysninger,
  søkerBorPåRegistrertAdresse?: ISpørsmålBooleanFelt
): T => {
  return {
    ...søknad,
    sivilstatus: validerSivilstatus(sivilstatus),
    medlemskap: validerMedlemskap(medlemskap),
    søkerBorPåRegistrertAdresse: søkerBorPåRegistrertAdresse,
    adresseopplysninger: validerAdresseopplysninger(
      harMeldtAdresseendring,
      søkerBorPåRegistrertAdresse
    ),
  };
};

const validerSivilstatus = (sivilstatus: ISivilstatus) => {
  const skalFjerneDatoSøktSeparasjon = sivilstatus.harSøktSeparasjon?.verdi === false;

  const skalFjerneDatoForSamlivsbrudd =
    sivilstatus.årsakEnslig?.svarid !== EBegrunnelse.samlivsbruddForeldre;

  const skalFjerneDatoEndretSamvær =
    sivilstatus.årsakEnslig?.svarid !== EBegrunnelse.endringISamværsordning;

  const skalFjerneTidligereSamboerDetaljer =
    sivilstatus.årsakEnslig?.svarid !== EBegrunnelse.samlivsbruddAndre;

  const fjernFødselsnummerFraTidligereSamboer =
    sivilstatus.tidligereSamboerDetaljer?.kjennerIkkeIdent === true;

  const skalFjerneDatoFlyttetFraHverandre =
    sivilstatus.årsakEnslig?.svarid !== EBegrunnelse.samlivsbruddAndre;

  return {
    ...sivilstatus,
    ...(skalFjerneDatoSøktSeparasjon && {
      datoSøktSeparasjon: undefined,
    }),
    tidligereSamboerDetaljer: utledTidligereSamboerDetaljer(
      skalFjerneTidligereSamboerDetaljer,
      fjernFødselsnummerFraTidligereSamboer,
      sivilstatus.tidligereSamboerDetaljer
    ),
    ...(skalFjerneDatoFlyttetFraHverandre && {
      datoFlyttetFraHverandre: undefined,
    }),
    ...(skalFjerneDatoForSamlivsbrudd && { datoForSamlivsbrudd: undefined }),
    ...(skalFjerneDatoEndretSamvær && { datoEndretSamvær: undefined }),
  };
};

const utledTidligereSamboerDetaljer = (
  skalFjerneTidligereSamboerDetaljer: boolean,
  fjernFødselsnummerFraTidligereSamboer: boolean,
  tidligereSamboerDetaljer: IPersonDetaljer | undefined
): IPersonDetaljer | undefined => {
  if (skalFjerneTidligereSamboerDetaljer) {
    return undefined;
  }
  if (fjernFødselsnummerFraTidligereSamboer && tidligereSamboerDetaljer) {
    return {
      ...tidligereSamboerDetaljer,
      ident: undefined,
    };
  }
  return tidligereSamboerDetaljer;
};

const validerMedlemskap = (medlemskap: IMedlemskap) => {
  const skalFjernePerioderBoddIUtlandet = medlemskap.søkerBosattINorgeSisteTreÅr?.verdi === true;

  const skalFjerneOppholdsland = medlemskap.søkerOppholderSegINorge?.verdi === true;

  return {
    ...medlemskap,
    ...(skalFjernePerioderBoddIUtlandet && {
      perioderBoddIUtlandet: undefined,
    }),
    ...(skalFjerneOppholdsland && { oppholdsland: undefined }),
  };
};

const validerAdresseopplysninger = (
  harMeldtAdresseendring?: IAdresseopplysninger,
  søkerBorPåRegistrertAdresse?: ISpørsmålBooleanFelt
) => {
  if (søkerBorPåRegistrertAdresse?.verdi === true) {
    return undefined;
  }
  return harMeldtAdresseendring;
};

export { validerOmDeg };
