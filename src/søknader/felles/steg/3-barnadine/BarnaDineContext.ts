import constate from 'constate';
import { MellomlagretSøknad, Søknad } from '../../../../models/søknad/søknad';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { IRoute } from '../../../../models/routes';
import { useState } from 'react';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import { useLocation } from 'react-router-dom';

export interface Props<T extends Søknad> {
  stønadstype: Stønadstype;
  søknad: T;
  oppdaterSøknad: (søknad: T) => void;
  mellomlagretSøknad: MellomlagretSøknad | undefined;
  mellomlagreSøknad: (steg: string, oppdatertSøknad: T) => void;
  routes: IRoute[];
  pathOppsummering: string | undefined;
  settDokumentasjonsbehovForBarn: (
    spørsmål: ISpørsmål,
    valgtSvar: ISvar,
    barneid: string,
    barnepassid?: string
  ) => void;
}

export const [BarnaDineProvider, useBarnaDine] = constate(
  ({
    stønadstype,
    søknad,
    oppdaterSøknad,
    mellomlagreSøknad,
    routes,
    pathOppsummering,
    settDokumentasjonsbehovForBarn,
  }: Props<Søknad>) => {
    const location = useLocation();
    const [barneliste, settBarneliste] = useState(søknad.person.barn);

    const mellomlagreSteg = () => {
      const oppdatertSøknad = { ...søknad, person: { ...søknad.person, barn: barneliste } };

      oppdaterSøknad(oppdatertSøknad);

      return mellomlagreSøknad(location.pathname, oppdatertSøknad);
    };

    return {
      stønadstype,
      søknad,
      barneliste,
      settBarneliste,
      mellomlagreSteg,
      routes,
      pathOppsummering,
      settDokumentasjonsbehovForBarn,
    };
  }
);
