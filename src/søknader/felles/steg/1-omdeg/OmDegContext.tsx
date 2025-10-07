import constate from 'constate';
import { useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { sanerOmDegSteg } from './sanerOmDegSteg';
import { MellomlagretSøknad, Søknad } from '../../../../models/søknad/søknad';
import { IRoute } from '../../../../models/routes';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import { ISpørsmålBooleanFelt } from '../../../../models/søknad/søknadsfelter';
import { IAdresseopplysninger } from '../../../../models/steg/adresseopplysninger';

export interface Props<T extends Søknad> {
  stønadstype: Stønadstype;
  søknad: T;
  oppdaterSøknad: (søknad: T) => void;
  mellomlagretSøknad: MellomlagretSøknad | undefined;
  mellomlagreSøknad: (steg: string, oppdatertSøknad: T) => void;
  routes: IRoute[];
  pathOppsummering: string | undefined;
  settDokumentasjonsbehov: (spørsmål: ISpørsmål, valgtSvar: ISvar, erHuketAv?: boolean) => void;
}

export const [OmDegProvider, useOmDeg] = constate(
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

    const [medlemskap, settMedlemskap] = useState(søknad.medlemskap);
    const [sivilstatus, settSivilstatus] = useState(søknad.sivilstatus);
    const [søkerBorPåRegistrertAdresse, settSøkerBorPåRegistrertAdresse] = useState(
      søknad.søkerBorPåRegistrertAdresse
    );
    const [adresseopplysninger, settAdresseopplysninger] = useState(søknad.adresseopplysninger);

    const mellomlagreSteg = () => {
      const oppdatertSøknad = sanerOmDegSteg(
        søknad,
        sivilstatus,
        medlemskap,
        adresseopplysninger,
        søkerBorPåRegistrertAdresse
      );

      oppdaterSøknad(oppdatertSøknad);

      return mellomlagreSøknad(location.pathname, oppdatertSøknad);
    };

    const oppdaterSøkerBorPåRegistrertAdresse = useCallback(
      (søkerBorPåRegistrertAdresseSpørsmål?: ISpørsmålBooleanFelt) => {
        settSøkerBorPåRegistrertAdresse(søkerBorPåRegistrertAdresseSpørsmål);

        settAdresseopplysninger(undefined);

        if (søkerBorPåRegistrertAdresseSpørsmål?.verdi === false) {
          settSivilstatus({});
          settMedlemskap({});
        }
      },
      []
    );

    const oppdaterAdresseopplysninger = useCallback(
      (harMeldtAdresseEndringSpørsmål?: IAdresseopplysninger) => {
        settAdresseopplysninger(harMeldtAdresseEndringSpørsmål);

        if (harMeldtAdresseEndringSpørsmål?.harMeldtAdresseendring?.verdi === false) {
          settSivilstatus({});
          settMedlemskap({});
        }
      },
      []
    );

    return {
      søkerBorPåRegistrertAdresse,
      settSøkerBorPåRegistrertAdresse: oppdaterSøkerBorPåRegistrertAdresse,
      adresseopplysninger,
      settAdresseopplysninger: oppdaterAdresseopplysninger,
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
