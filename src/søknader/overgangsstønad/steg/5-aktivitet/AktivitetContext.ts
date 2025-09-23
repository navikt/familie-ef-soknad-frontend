import { SøknadOvergangsstønad } from '../../models/søknad';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import constate from 'constate';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { IAktivitet } from '../../../../models/steg/aktivitet/aktivitet';

export interface Props {
  søknad: SøknadOvergangsstønad;
  oppdaterSøknad: (søknad: SøknadOvergangsstønad) => void;
  mellomlagreSøknad: (steg: string, oppdatertSøknad: SøknadOvergangsstønad) => void;
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
