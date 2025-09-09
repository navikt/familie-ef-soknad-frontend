import { MellomlagretSøknad } from '../../../../models/søknad/søknad';
import { IRoute } from '../../../../models/routes';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import constate from 'constate';
import { useLocation } from 'react-router-dom';
import { SøknadBarnetilsyn } from '../../models/søknad';
import { useState } from 'react';
import { IAktivitet } from '../../../../models/steg/aktivitet/aktivitet';

export interface Props {
  søknad: SøknadBarnetilsyn;
  oppdaterSøknad: (søknad: SøknadBarnetilsyn) => void;
  mellomlagretSøknad: MellomlagretSøknad | undefined;
  mellomlagreSøknad: (steg: string, oppdatertSøknad: SøknadBarnetilsyn) => void;
  routes: IRoute[];
  pathOppsummering: string | undefined;
  settDokumentasjonsbehov: (spørsmål: ISpørsmål, valgtSvar: ISvar, erHuketAv?: boolean) => void;
}

export const [AktivitetProvider, useAktivitet] = constate(
  ({
    søknad,
    oppdaterSøknad,
    mellomlagreSøknad,
    routes,
    pathOppsummering,
    settDokumentasjonsbehov,
  }: Props) => {
    const location = useLocation();

    const [aktivitet, settAktivitet] = useState(søknad.aktivitet);
    const [arbeidssituasjon, settArbeidssituasjon] = useState<IAktivitet>(søknad?.aktivitet);

    const mellomlagreSteg = () => {
      const oppdatertAktivitet = { ...aktivitet, ...arbeidssituasjon };

      const oppdatertSøknad = { ...søknad, aktivitet: oppdatertAktivitet };

      oppdaterSøknad(oppdatertSøknad);

      return mellomlagreSøknad(location.pathname, oppdatertSøknad);
    };

    return {
      aktivitet,
      settAktivitet,
      arbeidssituasjon,
      settArbeidssituasjon,
      søknad,
      mellomlagreSteg,
      routes,
      pathOppsummering,
      settDokumentasjonsbehov,
    };
  }
);
