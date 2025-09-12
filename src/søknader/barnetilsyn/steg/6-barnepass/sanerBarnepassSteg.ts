import { SøknadBarnetilsyn } from '../../models/søknad';
import { IBarn } from '../../../../models/steg/barn';
import { IDatoFelt, ISpørsmålBooleanFelt } from '../../../../models/søknad/søknadsfelter';

export const sanerBarnepassSteg = (
  søknad: SøknadBarnetilsyn,
  barn: IBarn[],
  søknadsdato: IDatoFelt | undefined,
  søkerFraBestemtMåned: ISpørsmålBooleanFelt | undefined
): SøknadBarnetilsyn => {
  return {
    ...søknad,
    person: { ...søknad.person, barn: barn },
    søknadsdato: sanerSøknadsdato(søknadsdato, søkerFraBestemtMåned),
    søkerFraBestemtMåned: søkerFraBestemtMåned,
  };
};

const sanerSøknadsdato = (
  søknadsdato: IDatoFelt | undefined,
  søkerFraBestemtMåned: ISpørsmålBooleanFelt | undefined
) => {
  return søkerFraBestemtMåned?.verdi === false ? undefined : søknadsdato;
};
