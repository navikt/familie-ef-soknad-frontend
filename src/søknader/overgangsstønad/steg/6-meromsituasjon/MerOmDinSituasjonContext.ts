import { SøknadOvergangsstønad } from '../../models/søknad';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import { IBarn } from '../../../../models/steg/barn';
import constate from 'constate';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { IDinSituasjon } from '../../../../models/steg/dinsituasjon/meromsituasjon';

export interface Props {
  søknad: SøknadOvergangsstønad;
  oppdaterSøknad: (søknad: SøknadOvergangsstønad) => void;
  mellomlagreMerOmDinSituasjonSteg: (steg: string, oppdatertSøknad: SøknadOvergangsstønad) => void;
  settDokumentasjonsbehov: (spørsmål: ISpørsmål, valgtSvar: ISvar, erHuketAv?: boolean) => void;
}

export const [MerOmDinSituasjonProvider, useMerOmDinSituasjon] = constate(
  ({
    søknad,
    oppdaterSøknad,
    mellomlagreMerOmDinSituasjonSteg,
    settDokumentasjonsbehov,
  }: Props) => {
    const location = useLocation();

    const [dinSituasjon, settDinSituasjon] = useState<IDinSituasjon>(søknad?.merOmDinSituasjon);

    const mellomlagreSteg = () => {
      const oppdatertDinSituasjon = { ...dinSituasjon };

      const oppdatertSøknad = { ...søknad, merOmDinSituasjon: oppdatertDinSituasjon };

      oppdaterSøknad(oppdatertSøknad);

      return mellomlagreMerOmDinSituasjonSteg(location.pathname, oppdatertSøknad);
    };

    const oppdaterBarnISøknaden = (oppdatertBarn: IBarn) => {
      const oppdatertSøknad = {
        ...søknad,
        person: {
          ...søknad.person,
          barn: søknad.person.barn.map((barn: IBarn) =>
            barn.id === oppdatertBarn.id ? oppdatertBarn : barn
          ),
        },
      };
      oppdaterSøknad(oppdatertSøknad);
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
