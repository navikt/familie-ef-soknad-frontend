import { SøknadBarnetilsyn } from '../../../barnetilsyn/models/søknad';
import { SøknadOvergangsstønad } from '../../../../models/søknad/søknad';
import { SøknadSkolepenger } from '../../../skolepenger/models/søknad';
import { IMedlemskap } from '../../../../models/steg/omDeg/medlemskap';
import {
  EBegrunnelse,
  ISivilstatus,
} from '../../../../models/steg/omDeg/sivilstatus';

const validerOmDeg = (
  søknad: SøknadBarnetilsyn | SøknadOvergangsstønad | SøknadSkolepenger,
  sivilstatus: ISivilstatus,
  medlemskap: IMedlemskap
): typeof søknad => {
  return {
    ...søknad,
    sivilstatus: validerSivilstatus(sivilstatus),
    medlemskap: validerMedlemskap(medlemskap),
  };
};

const validerSivilstatus = (sivilstatus: ISivilstatus) => {
  const skalFjerneDatoSøktSeparasjon =
    sivilstatus.harSøktSeparasjon?.verdi === false;

  const skalFjerneDatoForSamlivsbrudd =
    sivilstatus.årsakEnslig?.verdi !== EBegrunnelse.samlivsbruddForeldre;

  return {
    ...sivilstatus,
    ...(skalFjerneDatoSøktSeparasjon && {
      datoSøktSeparasjon: undefined,
    }),
    ...(skalFjerneDatoForSamlivsbrudd && { datoForSamlivsbrudd: undefined }),
  };
};

const validerMedlemskap = (medlemskap: IMedlemskap) => {
  const skalFjernePerioderBoddIUtlandet =
    medlemskap.søkerBosattINorgeSisteTreÅr?.verdi === true;

  const skalFjerneOppholdsland =
    medlemskap.søkerOppholderSegINorge?.verdi === true;

  return {
    ...medlemskap,
    ...(skalFjernePerioderBoddIUtlandet && {
      perioderBoddIUtlandet: undefined,
    }),
    ...(skalFjerneOppholdsland && { oppholdsland: undefined }),
  };
};

export { validerOmDeg };
