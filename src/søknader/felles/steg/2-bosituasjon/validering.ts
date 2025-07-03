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
  const { delerBoligMedAndreVoksne, samboerDetaljer, datoFlyttetSammenMedSamboer } = bosituasjon;

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
    default:
      return { ...bosituasjon };
  }
};
