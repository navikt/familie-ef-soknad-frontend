import constate from 'constate';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { validerMedlemskap } from './OmDegValidering';
import { MellomlagretSøknad, Søknad } from '../../../../models/søknad/søknad';
import { IRoute } from '../../../../models/routes';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';

export interface Props<T extends Søknad> {
  stønadstype: Stønadstype;
  søknad: T;
  oppdaterSøknad: (søknad: T) => void;
  mellomlagretSøknad: MellomlagretSøknad | undefined;
  mellomlagreSøknad: (steg: string, oppdatertSøknad: T) => void;
  routes: IRoute[];
  pathOppsummering: string | undefined;
  settDokumentasjonsbehov: (
    spørsmål: ISpørsmål,
    valgtSvar: ISvar,
    erHuketAv?: boolean
  ) => void;
}

export const [OmDegProvider, useOmDeg] = constate(
  ({
    stønadstype,
    søknad,
    oppdaterSøknad,
    mellomlagretSøknad,
    mellomlagreSøknad,
    routes,
    pathOppsummering,
    settDokumentasjonsbehov,
  }: Props<Søknad>) => {
    const location = useLocation();

    const [medlemskap, settMedlemskap] = useState(søknad.medlemskap);

    useEffect(() => {
      if (mellomlagretSøknad?.søknad.medlemskap) {
        settMedlemskap(mellomlagretSøknad.søknad.medlemskap);
      }
    }, [mellomlagretSøknad]);

    const mellomlagreSteg = () => {
      const oppdatertSøknad = validerMedlemskap({
        ...søknad,
        medlemskap: medlemskap,
      });

      oppdaterSøknad(oppdatertSøknad);

      return mellomlagreSøknad(location.pathname, oppdatertSøknad);
    };

    return {
      medlemskap,
      settMedlemskap,
      mellomlagreSteg,
      stønadstype,
      routes,
      pathOppsummering,
      settDokumentasjonsbehov,
      søknad,
      oppdaterSøknad,
    };
  }
);
