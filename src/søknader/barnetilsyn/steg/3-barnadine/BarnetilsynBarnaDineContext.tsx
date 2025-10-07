import constate from 'constate';
import { useLocation } from 'react-router-dom';
import { SøknadBarnetilsyn } from '../../models/søknad';
import { IBarn } from '../../../../models/steg/barn';
import { hentFeltObjekt } from '../../../../utils/søknad';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { IRoute } from '../../../../models/routes';

export interface Props {
  søknad: SøknadBarnetilsyn;
  oppdaterBarnISøknaden: (barn: IBarn) => void;
  mellomlagreBarnetilsyn: (steg: string) => void;
  routes: IRoute[];
  pathOppsummering: string | undefined;
}

export const [BarnetilsynBarnaDineProvider, useBarnetilsynBarnaDine] = constate(
  ({ søknad, oppdaterBarnISøknaden, mellomlagreBarnetilsyn, routes, pathOppsummering }: Props) => {
    const location = useLocation();

    const intl = useLokalIntlContext();

    const toggleSkalHaBarnepass = (id: string) => {
      const detteBarnet = søknad.person.barn.find((barn: IBarn) => barn.id === id);

      if (!detteBarnet) return;

      const skalHaBarnepassVerdi = !detteBarnet.skalHaBarnepass?.verdi;
      const nyttBarn: IBarn = {
        ...detteBarnet,
        skalHaBarnepass: hentFeltObjekt('barnekort.skalHaBarnepass', skalHaBarnepassVerdi, intl),
      };

      if (!skalHaBarnepassVerdi) {
        delete nyttBarn.barnepass;
      }

      oppdaterBarnISøknaden(nyttBarn);
    };

    const mellomlagreSteg = () => {
      return mellomlagreBarnetilsyn(location.pathname);
    };

    return {
      søknad,
      toggleSkalHaBarnepass,
      mellomlagreSteg,
      routes,
      pathOppsummering,
    };
  }
);
