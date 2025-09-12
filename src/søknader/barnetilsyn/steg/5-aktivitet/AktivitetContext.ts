import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import constate from 'constate';
import { useLocation } from 'react-router-dom';
import { SøknadBarnetilsyn } from '../../models/søknad';
import { useState } from 'react';
import { IAktivitet } from '../../../../models/steg/aktivitet/aktivitet';

export interface Props {
  søknad: SøknadBarnetilsyn;
  oppdaterSøknad: (søknad: SøknadBarnetilsyn) => void;
  mellomlagreSøknad: (steg: string, oppdatertSøknad: SøknadBarnetilsyn) => void;
  settDokumentasjonsbehov: (spørsmål: ISpørsmål, valgtSvar: ISvar, erHuketAv?: boolean) => void;
}

export const [AktivitetProvider, useAktivitet] = constate(
  ({ søknad, oppdaterSøknad, mellomlagreSøknad, settDokumentasjonsbehov }: Props) => {
    const location = useLocation();

    const [aktivitet, settAktivitet] = useState<IAktivitet>(søknad?.aktivitet);

    const mellomlagreSteg = () => {
      const oppdatertAktivitet = { ...aktivitet };

      const oppdatertSøknad = { ...søknad, aktivitet: oppdatertAktivitet };

      oppdaterSøknad(oppdatertSøknad);

      return mellomlagreSøknad(location.pathname, oppdatertSøknad);
    };

    return {
      aktivitet,
      settAktivitet,
      søknad,
      mellomlagreSteg,
      settDokumentasjonsbehov,
    };
  }
);
