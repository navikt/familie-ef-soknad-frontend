import { Søknad } from '../../../../models/søknad/søknad';
import { ESøkerDelerBolig, IBosituasjon } from '../../../../models/steg/bosituasjon';
import {
  IDatoFelt,
  ISpørsmålBooleanFelt,
  ISpørsmålFelt,
} from '../../../../models/søknad/søknadsfelter';
import { harVerdi } from '../../../../utils/typer';
import { IPersonDetaljer } from '../../../../models/søknad/person';

export const validerBosituasjonSteg = <T extends Søknad>(
  søknad: T,
  bosituasjon: IBosituasjon
): T => {
  return {
    ...søknad,
    bosituasjon: validerBosituasjon(bosituasjon),
  };
};

const validerBosituasjon = (bosituasjon: IBosituasjon): IBosituasjon => {
  const {
    delerBoligMedAndreVoksne,
    samboerDetaljer,
    datoFlyttetSammenMedSamboer,
    skalGifteSegEllerBliSamboer,
    datoSkalGifteSegEllerBliSamboer,
    vordendeSamboerEktefelle,
  } = bosituasjon;

  switch (delerBoligMedAndreVoksne.svarid) {
    case ESøkerDelerBolig.borSammenOgVenterBarn:
    case ESøkerDelerBolig.borMidlertidigFraHverandre:
      return { delerBoligMedAndreVoksne: delerBoligMedAndreVoksne };
    case ESøkerDelerBolig.harEkteskapsliknendeForhold:
      return {
        delerBoligMedAndreVoksne: delerBoligMedAndreVoksne,
        samboerDetaljer: samboerDetaljer,
        datoFlyttetSammenMedSamboer: datoFlyttetSammenMedSamboer,
      };
    case ESøkerDelerBolig.delerBoligMedAndreVoksne:
      return utledDelerBoligMedAndreVoksne(
        delerBoligMedAndreVoksne,
        skalGifteSegEllerBliSamboer,
        datoSkalGifteSegEllerBliSamboer,
        vordendeSamboerEktefelle
      );
    default:
      return { ...bosituasjon };
  }
};

const utledDelerBoligMedAndreVoksne = (
  delerBoligMedAndreVoksne: ISpørsmålFelt,
  skalGifteSegEllerBliSamboer?: ISpørsmålBooleanFelt,
  datoSkalGifteSegEllerBliSamboer?: IDatoFelt,
  vordendeSamboerEktefelle?: IPersonDetaljer
): IBosituasjon => {
  if (skalGifteSegEllerBliSamboer && skalGifteSegEllerBliSamboer.verdi) {
    return {
      delerBoligMedAndreVoksne: delerBoligMedAndreVoksne,
      skalGifteSegEllerBliSamboer: skalGifteSegEllerBliSamboer,
      datoSkalGifteSegEllerBliSamboer: datoSkalGifteSegEllerBliSamboer,
      vordendeSamboerEktefelle: vordendeSamboerEktefelle,
    };
  }

  return {
    delerBoligMedAndreVoksne: delerBoligMedAndreVoksne,
    skalGifteSegEllerBliSamboer: skalGifteSegEllerBliSamboer,
  };
};
