import constate from 'constate';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { validerOmDeg } from './OmDegValidering';
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
    const [sivilstatus, settSivilstatus] = useState(søknad.sivilstatus);
    const [søkerBorPåRegistrertAdresse, settSøkerBorPåRegistrertAdresse] =
      useState(søknad.søkerBorPåRegistrertAdresse);
    const [harMeldtAdresseendring, settHarMeldtAdresseendring] = useState(
      søknad.adresseopplysninger?.harMeldtAdresseendring
    );

    useEffect(() => {
      if (mellomlagretSøknad?.søknad.medlemskap) {
        settMedlemskap(mellomlagretSøknad.søknad.medlemskap);
      }
      if (mellomlagretSøknad?.søknad.sivilstatus) {
        settSivilstatus(mellomlagretSøknad.søknad.sivilstatus);
      }
      if (mellomlagretSøknad?.søknad.søkerBorPåRegistrertAdresse) {
        settSøkerBorPåRegistrertAdresse(
          mellomlagretSøknad.søknad.søkerBorPåRegistrertAdresse
        );
      }
      if (
        mellomlagretSøknad?.søknad.adresseopplysninger?.harMeldtAdresseendring
      ) {
        settHarMeldtAdresseendring(
          mellomlagretSøknad.søknad.adresseopplysninger.harMeldtAdresseendring
        );
      }
    }, [mellomlagretSøknad]);

    const mellomlagreSteg = () => {
      const oppdatertSøknad = validerOmDeg(søknad, sivilstatus, medlemskap);

      oppdaterSøknad(oppdatertSøknad);

      return mellomlagreSøknad(location.pathname, oppdatertSøknad);
    };

    return {
      søkerBorPåRegistrertAdresse,
      settSøkerBorPåRegistrertAdresse,
      harMeldtAdresseendring,
      settHarMeldtAdresseendring,
      sivilstatus,
      settSivilstatus,
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
