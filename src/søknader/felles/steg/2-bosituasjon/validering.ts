import { Søknad } from '../../../../models/søknad/søknad';
import { ESøkerDelerBolig, IBosituasjon } from '../../../../models/steg/bosituasjon';

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
  const { delerBoligMedAndreVoksne } = bosituasjon;

  switch (delerBoligMedAndreVoksne.svarid as ESøkerDelerBolig) {
    case ESøkerDelerBolig.borSammenOgVenterBarn:
    case ESøkerDelerBolig.borMidlertidigFraHverandre:
      return { delerBoligMedAndreVoksne: delerBoligMedAndreVoksne };
    case ESøkerDelerBolig.harEkteskapsliknendeForhold:
      return utledHarEkteskapsliknendeForhold(bosituasjon);
    case ESøkerDelerBolig.delerBoligMedAndreVoksne:
      return utledDelerBoligMedAndreVoksne(bosituasjon);
    case ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse:
      return utledTidligereSamboerFortsattRegistrertPåSammeAdresse(bosituasjon);
    case ESøkerDelerBolig.borAleneMedBarnEllerGravid:
      return utledBorAleneMedBarnEllerGravid(bosituasjon);
  }
};

const utledHarEkteskapsliknendeForhold = (bosituasjon: IBosituasjon): IBosituasjon => {
  const { delerBoligMedAndreVoksne, samboerDetaljer, datoFlyttetSammenMedSamboer } = bosituasjon;

  return {
    delerBoligMedAndreVoksne: delerBoligMedAndreVoksne,
    samboerDetaljer: samboerDetaljer,
    datoFlyttetSammenMedSamboer: datoFlyttetSammenMedSamboer,
  };
};

const utledDelerBoligMedAndreVoksne = (bosituasjon: IBosituasjon): IBosituasjon => {
  const {
    delerBoligMedAndreVoksne,
    skalGifteSegEllerBliSamboer,
    datoSkalGifteSegEllerBliSamboer,
    vordendeSamboerEktefelle,
  } = bosituasjon;

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

const utledTidligereSamboerFortsattRegistrertPåSammeAdresse = (
  bosituasjon: IBosituasjon
): IBosituasjon => {
  const {
    delerBoligMedAndreVoksne,
    samboerDetaljer,
    datoFlyttetFraHverandre,
    skalGifteSegEllerBliSamboer,
    datoSkalGifteSegEllerBliSamboer,
    vordendeSamboerEktefelle,
  } = bosituasjon;

  if (skalGifteSegEllerBliSamboer && skalGifteSegEllerBliSamboer.verdi) {
    return {
      delerBoligMedAndreVoksne: delerBoligMedAndreVoksne,
      samboerDetaljer: samboerDetaljer,
      datoFlyttetFraHverandre: datoFlyttetFraHverandre,
      skalGifteSegEllerBliSamboer: skalGifteSegEllerBliSamboer,
      datoSkalGifteSegEllerBliSamboer: datoSkalGifteSegEllerBliSamboer,
      vordendeSamboerEktefelle: vordendeSamboerEktefelle,
    };
  }

  return {
    delerBoligMedAndreVoksne: delerBoligMedAndreVoksne,
    samboerDetaljer: samboerDetaljer,
    datoFlyttetFraHverandre: datoFlyttetFraHverandre,
    skalGifteSegEllerBliSamboer: skalGifteSegEllerBliSamboer,
  };
};

const utledBorAleneMedBarnEllerGravid = (bosituasjon: IBosituasjon): IBosituasjon => {
  const {
    delerBoligMedAndreVoksne,
    skalGifteSegEllerBliSamboer,
    datoSkalGifteSegEllerBliSamboer,
    vordendeSamboerEktefelle,
  } = bosituasjon;

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
