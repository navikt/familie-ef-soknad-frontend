import { Søknad } from '../../../../models/søknad/søknad';
import { IMedlemskap } from '../../../../models/steg/omDeg/medlemskap';
import { EBegrunnelse, ISivilstatus } from '../../../../models/steg/omDeg/sivilstatus';
import { IPersonDetaljer } from '../../../../models/søknad/person';
import { ISpørsmålBooleanFelt } from '../../../../models/søknad/søknadsfelter';
import { IAdresseopplysninger } from '../../../../models/steg/adresseopplysninger';
import { sanerBrukerInput } from '../../../../utils/sanering';

export const sanerOmDegSteg = <T extends Søknad>(
  søknad: T,
  sivilstatus: ISivilstatus,
  medlemskap: IMedlemskap,
  harMeldtAdresseendring?: IAdresseopplysninger,
  søkerBorPåRegistrertAdresse?: ISpørsmålBooleanFelt
): T => {
  return {
    ...søknad,
    sivilstatus: sanerSivilstatus(sivilstatus),
    medlemskap: sanerMedlemskap(medlemskap),
    søkerBorPåRegistrertAdresse: søkerBorPåRegistrertAdresse,
    adresseopplysninger: sanerAdresseopplysninger(
      harMeldtAdresseendring,
      søkerBorPåRegistrertAdresse
    ),
  };
};

const sanerSivilstatus = (sivilstatus: ISivilstatus) => {
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

  if (tidligereSamboerDetaljer) {
    return {
      ...tidligereSamboerDetaljer,
      navn: tidligereSamboerDetaljer.navn
        ? {
            ...tidligereSamboerDetaljer.navn,
            verdi: sanerBrukerInput(tidligereSamboerDetaljer.navn.verdi),
          }
        : undefined,
      ident: tidligereSamboerDetaljer.ident
        ? {
            ...tidligereSamboerDetaljer.ident,
            verdi: sanerBrukerInput(tidligereSamboerDetaljer.ident.verdi),
          }
        : undefined,
    };
  }

  return tidligereSamboerDetaljer;
};

const sanerMedlemskap = (medlemskap: IMedlemskap) => {
  const skalFjernePerioderBoddIUtlandet = medlemskap.søkerBosattINorgeSisteTreÅr?.verdi === true;

  const skalFjerneOppholdsland = medlemskap.søkerOppholderSegINorge?.verdi === true;

  const sanertPerioderBoddIUtlandet = medlemskap.perioderBoddIUtlandet?.map((opphold) => ({
    ...opphold,
    begrunnelse: opphold.begrunnelse
      ? { ...opphold.begrunnelse, verdi: sanerBrukerInput(opphold.begrunnelse.verdi) }
      : opphold.begrunnelse,
    adresseEøsLand: opphold.adresseEøsLand
      ? { ...opphold.adresseEøsLand, verdi: sanerBrukerInput(opphold.adresseEøsLand.verdi) }
      : opphold.adresseEøsLand,
  }));

  return {
    ...medlemskap,
    perioderBoddIUtlandet: skalFjernePerioderBoddIUtlandet
      ? undefined
      : sanertPerioderBoddIUtlandet,
    ...(skalFjerneOppholdsland && { oppholdsland: undefined }),
  };
};

const sanerAdresseopplysninger = (
  harMeldtAdresseendring?: IAdresseopplysninger,
  søkerBorPåRegistrertAdresse?: ISpørsmålBooleanFelt
) => {
  if (søkerBorPåRegistrertAdresse?.verdi === true) {
    return undefined;
  }
  return harMeldtAdresseendring;
};
