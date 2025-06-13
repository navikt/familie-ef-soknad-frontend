import { SøknadBarnetilsyn } from '../../../barnetilsyn/models/søknad';
import { SøknadOvergangsstønad } from '../../../../models/søknad/søknad';
import { SøknadSkolepenger } from '../../../skolepenger/models/søknad';

const validerMedlemskap = (
  søknad: SøknadBarnetilsyn | SøknadOvergangsstønad | SøknadSkolepenger
): typeof søknad => {
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
