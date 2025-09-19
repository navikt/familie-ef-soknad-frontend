import { MellomlagretSøknad, Søknad } from '../../../../models/søknad/søknad';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { IRoute } from '../../../../models/routes';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import constate from 'constate';
import { useLocation } from 'react-router-dom';
import { IBarn } from '../../../../models/steg/barn';
import { SettDokumentasjonsbehovBarn } from '../../../overgangsstønad/models/søknad';

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
    oppdaterBarnISøknaden,
    oppdaterFlereBarnISøknaden,
    mellomlagreSøknad,
    routes,
    pathOppsummering,
    settDokumentasjonsbehov,
    settDokumentasjonsbehovForBarn,
  }: Props<Søknad>) => {
    const location = useLocation();

    const mellomlagreSteg = () => {
      const oppdatertSøknad = søknad; //TODO

      return mellomlagreSøknad(location.pathname, oppdatertSøknad);
    };

    const aktuelleBarn =
      stønadstype === Stønadstype.barnetilsyn
        ? søknad.person.barn.filter((barn: IBarn) => barn.skalHaBarnepass?.verdi)
        : søknad.person.barn;

    return {
      aktuelleBarn,
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
    };
  }
);
