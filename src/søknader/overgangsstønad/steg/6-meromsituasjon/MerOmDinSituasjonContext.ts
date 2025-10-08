import { SøknadOvergangsstønad } from '../../models/søknad';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import { IBarn } from '../../../../models/steg/barn';
import constate from 'constate';
import { useLocation } from 'react-router-dom';
import { IDinSituasjon } from '../../../../models/steg/dinsituasjon/meromsituasjon';
import { sanerMerOmDinSituasjonSteg } from './sanerMerOmDinSituasjonSteg';

export interface Props {
  søknad: SøknadOvergangsstønad;
  oppdaterSøknad: (søknad: SøknadOvergangsstønad) => void;
  mellomlagreMerOmDinSituasjonSteg: (steg: string, oppdatertSøknad: SøknadOvergangsstønad) => void;
  settDokumentasjonsbehov: (spørsmål: ISpørsmål, valgtSvar: ISvar, erHuketAv?: boolean) => void;
  oppdaterBarnISøknaden: (oppdatertBarn: IBarn) => void;
}

export const [MerOmDinSituasjonProvider, useMerOmDinSituasjon] = constate(
  ({
    søknad,
    oppdaterSøknad,
    mellomlagreMerOmDinSituasjonSteg,
    settDokumentasjonsbehov,
    oppdaterBarnISøknaden,
  }: Props) => {
    const location = useLocation();

    const dinSituasjon = søknad.merOmDinSituasjon;

    const settDinSituasjon = (oppdatertDinSituasjon: IDinSituasjon) => {
      const oppdatertSøknad = { ...søknad, merOmDinSituasjon: oppdatertDinSituasjon };
      oppdaterSøknad(oppdatertSøknad);
    };

    const mellomlagreSteg = () => {
      const oppdatertDinSituasjon = { ...dinSituasjon };

      const oppdatertSøknad = { ...søknad, merOmDinSituasjon: oppdatertDinSituasjon };

      const sanertSøknad = sanerMerOmDinSituasjonSteg(oppdatertSøknad);

      oppdaterSøknad(sanertSøknad);

      return mellomlagreMerOmDinSituasjonSteg(location.pathname, sanertSøknad);
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
