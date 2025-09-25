import { SøknadOvergangsstønad } from '../../models/søknad';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import constate from 'constate';
import { useLocation } from 'react-router-dom';
import { IBarn } from '../../../../models/steg/barn';
import { useState } from 'react';
import { IDinSituasjon } from '../../../../models/steg/dinsituasjon/meromsituasjon';

export interface Props {
  søknad: SøknadOvergangsstønad;
  oppdaterSøknad: (søknad: SøknadOvergangsstønad) => void;
  mellomlagreSøknad: (steg: string, oppdatertSøknad: SøknadOvergangsstønad) => void;
  settDokumentasjonsbehov: (spørsmål: ISpørsmål, valgtSvar: ISvar, erHuketAv?: boolean) => void;
  oppdaterBarnISøknaden: (oppdatertBarn: IBarn) => void;
}

export const [MerOmDinSituasjonProvider, useMerOmDinSituasjon] = constate(
  ({
    søknad,
    oppdaterSøknad,
    mellomlagreSøknad,
    settDokumentasjonsbehov,
    oppdaterBarnISøknaden,
  }: Props) => {
    const location = useLocation();

    const [dinSituasjon, settDinSituasjon] = useState<IDinSituasjon>(søknad?.merOmDinSituasjon);

    const mellomlagreSteg = () => {
      const oppdatertSøknad = { ...søknad, merOmDinSituasjon: dinSituasjon };

      oppdaterSøknad(oppdatertSøknad);

      return mellomlagreSøknad(location.pathname, oppdatertSøknad);
    };

    return {
      dinSituasjon,
      settDinSituasjon,
      søknad,
      mellomlagreSteg,
      settDokumentasjonsbehov,
      oppdaterBarnISøknaden,
    };
  }
);
