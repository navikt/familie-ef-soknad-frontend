import constate from 'constate';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { MellomlagretSøknad, Søknad } from '../../../../models/søknad/søknad';
import { IRoute } from '../../../../models/routes';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import { validerBosituasjonSteg } from './validering';
import { IBosituasjon } from '../../../../models/steg/bosituasjon';

interface Props<T extends Søknad> {
  stønadstype: Stønadstype;
  søknad: T;
  oppdaterSøknad: (søknad: T) => void;
  mellomlagretSøknad: MellomlagretSøknad | undefined;
  mellomlagreSøknad: (steg: string, oppdatertSøknad: T) => void;
  routes: IRoute[];
  pathOppsummering: string | undefined;
  settDokumentasjonsbehov: (spørsmål: ISpørsmål, valgtSvar: ISvar, erHuketAv?: boolean) => void;
}

export const [BosituasjonProvider, useBosituasjon] = constate(
  ({
    stønadstype,
    søknad,
    oppdaterSøknad,
    mellomlagreSøknad,
    routes,
    pathOppsummering,
    settDokumentasjonsbehov,
  }: Props<Søknad>) => {
    const location = useLocation();

    const [bosituasjon, settBosituasjon] = useState<IBosituasjon>(søknad.bosituasjon);

    const mellomlagreSteg = () => {
      const oppdatertSøknad = validerBosituasjonSteg(søknad, bosituasjon);

      oppdaterSøknad(oppdatertSøknad);

      return mellomlagreSøknad(location.pathname, oppdatertSøknad);
    };

    return {
      stønadstype,
      bosituasjon,
      routes,
      pathOppsummering,
      settDokumentasjonsbehov,
      settBosituasjon,
      mellomlagreSteg,
    };
  }
);
