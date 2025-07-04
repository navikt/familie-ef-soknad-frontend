import { Søknad } from '../../../../models/søknad/søknad';
import { ESøkerDelerBolig, IBosituasjon } from '../../../../models/steg/bosituasjon';

export const sanerBosituasjonSteg = <T extends Søknad>(søknad: T, bosituasjon: IBosituasjon): T => {
  return {
    ...søknad,
    bosituasjon: sanerBosituasjon(bosituasjon),
  };
};

const sanerBosituasjon = (bosituasjon: IBosituasjon): IBosituasjon => {
  const { delerBoligMedAndreVoksne } = bosituasjon;

  switch (delerBoligMedAndreVoksne.svarid as ESøkerDelerBolig) {
    case ESøkerDelerBolig.borSammenOgVenterBarn:
    case ESøkerDelerBolig.borMidlertidigFraHverandre:
      return { delerBoligMedAndreVoksne: delerBoligMedAndreVoksne };
    case ESøkerDelerBolig.harEkteskapsliknendeForhold:
      return sanerHarEkteskapsliknendeForhold(bosituasjon);
    case ESøkerDelerBolig.delerBoligMedAndreVoksne:
    case ESøkerDelerBolig.borAleneMedBarnEllerGravid:
      return sanerDelerBoligMedAndreVoksneEllerSøkerBorAleneMedBarnEllerGravid(bosituasjon);
    case ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse:
      return sanerTidligereSamboerFortsattRegistrertPåSammeAdresse(bosituasjon);
  }
};

const sanerHarEkteskapsliknendeForhold = (bosituasjon: IBosituasjon): IBosituasjon => {
  const { delerBoligMedAndreVoksne, samboerDetaljer, datoFlyttetSammenMedSamboer } = bosituasjon;

  return {
    delerBoligMedAndreVoksne: delerBoligMedAndreVoksne,
    samboerDetaljer: samboerDetaljer,
    datoFlyttetSammenMedSamboer: datoFlyttetSammenMedSamboer,
  };
};

const sanerDelerBoligMedAndreVoksneEllerSøkerBorAleneMedBarnEllerGravid = (
  bosituasjon: IBosituasjon
): IBosituasjon => {
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

const sanerTidligereSamboerFortsattRegistrertPåSammeAdresse = (
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
