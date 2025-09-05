import constate from 'constate';
import { MellomlagretSøknad } from '../../../../models/søknad/søknad';
import { IRoute } from '../../../../models/routes';
import { useLocation } from 'react-router-dom';
import { SøknadBarnetilsyn } from '../../models/søknad';
import { useState } from 'react';
import { sanering } from './sanering';
import { SettDokumentasjonsbehovBarn } from '../../../overgangsstønad/models/søknad';

export interface Props {
  søknad: SøknadBarnetilsyn;
  oppdaterSøknad: (søknad: SøknadBarnetilsyn) => void;
  mellomlagretSøknad: MellomlagretSøknad | undefined;
  mellomlagreSøknad: (steg: string, oppdatertSøknad: SøknadBarnetilsyn) => void;
  routes: IRoute[];
  pathOppsummering: string | undefined;
  settDokumentasjonsbehovForBarn: SettDokumentasjonsbehovBarn;
}

export const [BarnepassProvider, useBarnepass] = constate(
  ({
    søknad,
    oppdaterSøknad,
    mellomlagreSøknad,
    routes,
    pathOppsummering,
    settDokumentasjonsbehovForBarn,
  }: Props) => {
    const location = useLocation();

    const [barn, settBarn] = useState(søknad.person.barn);
    const [søknadsdato, settSøknadsdato] = useState(søknad.søknadsdato);
    const [søkerFraBestemtMåned, settSøkerFraBestemtMåned] = useState(søknad.søkerFraBestemtMåned);

    const mellomlagreSteg = () => {
      const oppdatertSøknad = sanering(søknad, barn, søknadsdato, søkerFraBestemtMåned); //TODO sanering,

      oppdaterSøknad(oppdatertSøknad);

      return mellomlagreSøknad(location.pathname, oppdatertSøknad);
    };

    return {
      barn,
      settBarn,
      søknadsdato,
      settSøknadsdato,
      søkerFraBestemtMåned,
      settSøkerFraBestemtMåned,
      mellomlagreSteg,
      søknad,
      oppdaterSøknad,
      routes,
      pathOppsummering,
      settDokumentasjonsbehovForBarn,
    };
  }
);
