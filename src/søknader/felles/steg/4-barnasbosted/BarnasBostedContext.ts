import { MellomlagretSøknad, Søknad } from '../../../../models/søknad/søknad';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { IRoute } from '../../../../models/routes';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import constate from 'constate';
import { useLocation } from 'react-router-dom';
import { IBarn } from '../../../../models/steg/barn';
import { SettDokumentasjonsbehovBarn } from '../../../overgangsstønad/models/søknad';
import { useState } from 'react';
import {
  antallBarnMedForeldreUtfylt,
  forelderidentMedBarn,
  kopierFellesForeldreInformasjon,
  oppdaterBarneliste,
  oppdaterBarnIBarneliste,
} from '../../../../utils/barn';
import { sanerBarnasBostedSteg } from './sanerBarnasBostedSteg';

export interface Props<T extends Søknad> {
  stønadstype: Stønadstype;
  søknad: T;
  oppdaterSøknad: (søknad: T) => void;
  oppdaterBarnISøknaden: (oppdatertBarn: IBarn) => void;
  oppdaterFlereBarnISøknaden: (oppdaterteBarn: IBarn[]) => void;
  mellomlagretSøknad: MellomlagretSøknad | undefined;
  mellomlagreSøknad: (steg: string, oppdatertSøknad: T) => void;
  routes: IRoute[];
  pathOppsummering: string | undefined;
  settDokumentasjonsbehov: (spørsmål: ISpørsmål, valgtSvar: ISvar, erHuketAv?: boolean) => void;
  settDokumentasjonsbehovForBarn: SettDokumentasjonsbehovBarn;
}

export const [BarnasBostedProvider, useBarnasBosted] = constate(
  ({
    stønadstype,
    søknad,
    oppdaterSøknad,
    mellomlagreSøknad,
    routes,
    pathOppsummering,
    settDokumentasjonsbehov,
    settDokumentasjonsbehovForBarn,
  }: Props<Søknad>) => {
    const location = useLocation();

    const mellomlagreSteg = () => {
      const oppdatertSøknad = sanerBarnasBostedSteg(søknad, barnISøknad); //TODO

      return mellomlagreSøknad(location.pathname, oppdatertSøknad);
    };
    const aktuelleBarn =
      stønadstype === Stønadstype.barnetilsyn
        ? søknad.person.barn.filter((barn: IBarn) => barn.skalHaBarnepass?.verdi)
        : søknad.person.barn;

    const [barnISøknad, settBarnISøknad] = useState<IBarn[]>(aktuelleBarn);

    const barnMedLevendeMedforelder = barnISøknad.filter((barn: IBarn) => {
      return !barn.medforelder?.verdi || barn.medforelder?.verdi?.død === false;
    });

    const [sisteBarnUtfylt, settSisteBarnUtfylt] = useState<boolean>(
      antallBarnMedForeldreUtfylt(barnMedLevendeMedforelder) === barnMedLevendeMedforelder.length
    );

    const oppdaterBarnISøknaden = (oppdatertBarn: IBarn) => {
      settBarnISøknad(oppdaterBarnIBarneliste(barnISøknad, oppdatertBarn));
    };

    const oppdaterFlereBarnISøknaden = (oppdaterteBarn: IBarn[]) => {
      settBarnISøknad(oppdaterBarneliste(barnISøknad, oppdaterteBarn));
    };

    const barnMedLevendeMedforelderEllerUndefined = barnISøknad.filter(
      (barn: IBarn) =>
        !barn.medforelder?.verdi ||
        (barn.medforelder?.verdi && barn.medforelder?.verdi?.død !== true)
    );

    const forelderIdenterMedBarn = forelderidentMedBarn(barnMedLevendeMedforelderEllerUndefined);

    const oppdaterBarnMedNyForelderInformasjon = (
      oppdatertBarn: IBarn,
      skalKopiereForeldreinformasjonTilAndreBarn: boolean
    ) => {
      const barnMedSammeForelder =
        oppdatertBarn.forelder?.ident?.verdi &&
        forelderIdenterMedBarn.get(oppdatertBarn.forelder?.ident?.verdi);

      if (skalKopiereForeldreinformasjonTilAndreBarn && barnMedSammeForelder) {
        oppdaterFlereBarnISøknaden(
          barnMedSammeForelder.map((b) => {
            if (b.id === oppdatertBarn.id) {
              return oppdatertBarn;
            }

            return oppdatertBarn.forelder
              ? kopierFellesForeldreInformasjon(b, oppdatertBarn.forelder)
              : b;
          })
        );
      } else {
        oppdaterBarnISøknaden(oppdatertBarn);
      }
    };

    return {
      sisteBarnUtfylt,
      settSisteBarnUtfylt,
      barnISøknad,
      settBarnISøknad,
      mellomlagreSteg,
      oppdaterBarnISøknaden,
      oppdaterFlereBarnISøknaden,
      oppdaterSøknad,
      pathOppsummering,
      routes,
      settDokumentasjonsbehov,
      settDokumentasjonsbehovForBarn,
      stønadstype,
      søknad,
      barnMedLevendeMedforelderEllerUndefined,
      forelderIdenterMedBarn,
      oppdaterBarnMedNyForelderInformasjon,
    };
  }
);
