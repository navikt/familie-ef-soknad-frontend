import constate from 'constate';
import { useState } from 'react';
import { IRoute } from '../../../../models/routes';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { Søknad } from '../../../../models/søknad/søknad';

export interface Props<T extends Søknad> {
  stønadstype: Stønadstype;
  søknad: T;
  oppdaterSøknad: (søknad: T) => void;
  mellomlagreSøknad: (steg: string, oppdatertSøknad: T) => void;
  routes: IRoute[];
  // settDokumentasjonsbehov: (spørsmål: ISpørsmål, valgtSvar: ISvar, erHuketAv?: boolean) => void;
}

export const [DokumentasjonsProvider, useDokumentasjon] = constate(
  ({ stønadstype, søknad, oppdaterSøknad, mellomlagreSøknad, routes }: Props<Søknad>) => {
    const [dokumentasjonsbehov, settDokumentasjonsbehov] = useState(søknad.dokumentasjonsbehov);

    const mellomlagreSteg = () => {
      const oppdatertSøknad = { ...søknad, dokumentasjonsbehov: dokumentasjonsbehov };

      oppdaterSøknad(oppdatertSøknad);

      return mellomlagreSøknad(location.pathname, oppdatertSøknad);
    };

    return {
      stønadstype,
      søknad,
      dokumentasjonsbehov,
      settDokumentasjonsbehov,
      mellomlagreSteg,
      routes,
    };
  }
);
