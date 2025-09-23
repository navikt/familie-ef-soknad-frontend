import { Søknad } from '../../../../models/søknad/søknad';
import { IBarn } from '../../../../models/steg/barn';
import {
  EHarSamværMedBarn,
  EHarSkriftligSamværsavtale,
} from '../../../../models/steg/barnasbosted';
import { ITekstFelt } from '../../../../models/søknad/søknadsfelter';

export const sanerBarnasBostedSteg = <T extends Søknad>(søknad: T, barneListe: IBarn[]): T => {
  return { ...søknad, person: { ...søknad.person, barn: sanerbarn(barneListe) } };
};

const sanerbarn = (barneliste: IBarn[]) => {
  return barneliste.map((barn) => {
    const sanertHvordanPraktiseresSamvær = sanerHvordanPraktiseresSamvær(barn);

    return {
      ...barn,
      forelder: { ...barn.forelder, hvordanPraktiseresSamværet: sanertHvordanPraktiseresSamvær },
    };
  });
};

const sanerHvordanPraktiseresSamvær = (barn: IBarn): ITekstFelt | undefined => {
  const { forelder } = barn;

  const skalHaMedHvordanPraktisererSamvær =
    forelder?.harAnnenForelderSamværMedBarn?.svarid === EHarSamværMedBarn.jaMerEnnVanlig &&
    (forelder?.harDereSkriftligSamværsavtale?.svarid ===
      EHarSkriftligSamværsavtale.jaIkkeKonkreteTidspunkter ||
      forelder?.harDereSkriftligSamværsavtale?.svarid === EHarSkriftligSamværsavtale.nei);

  return skalHaMedHvordanPraktisererSamvær ? barn.forelder?.hvordanPraktiseresSamværet : undefined;
};
