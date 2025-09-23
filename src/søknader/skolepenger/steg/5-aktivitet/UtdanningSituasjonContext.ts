import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import constate from 'constate';
import { useLocation } from 'react-router-dom';
import { SøknadSkolepenger } from '../../models/søknad';

export interface Props {
  søknad: SøknadSkolepenger;
  oppdaterSøknad: (søknad: SøknadSkolepenger) => void;
  mellomlagreSøknad: (steg: string, oppdatertSøknad: SøknadSkolepenger) => void;
  settDokumentasjonsbehov: (spørsmål: ISpørsmål, valgtSvar: ISvar, erHuketAv?: boolean) => void;
}

export const [UtdanningSituasjonProvider, useUtdanningSituasjon] = constate(
  ({ søknad, oppdaterSøknad, mellomlagreSøknad, settDokumentasjonsbehov }: Props) => {
    const location = useLocation();
  }
);
