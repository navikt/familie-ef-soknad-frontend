import { Søknad } from '../../../../models/søknad/søknad';

const validerMedlemskap = <T extends Søknad>(søknad: T): T => {
  const medlemskap = søknad.medlemskap;

  //TODO Sjekke om alle spørsmål er besvart

  const skalFjernePerioderBoddIUtlandet =
    medlemskap.søkerBosattINorgeSisteTreÅr?.verdi === true;

  const skalFjerneOppholdsland =
    medlemskap.søkerOppholderSegINorge?.verdi === true;

  const oppdatertMedlemskap = {
    ...medlemskap,
    ...(skalFjernePerioderBoddIUtlandet && {
      perioderBoddIUtlandet: undefined,
    }),
    ...(skalFjerneOppholdsland && { oppholdsland: undefined }),
  };

  return {
    ...søknad,
    medlemskap: oppdatertMedlemskap,
  };
};

export { validerMedlemskap };
