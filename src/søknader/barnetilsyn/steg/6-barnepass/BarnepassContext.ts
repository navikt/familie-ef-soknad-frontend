import constate from 'constate';
import { MellomlagretSøknad } from '../../../../models/søknad/søknad';
import { IRoute } from '../../../../models/routes';
import { useLocation } from 'react-router-dom';
import { SøknadBarnetilsyn } from '../../models/søknad';
import { useState } from 'react';
import { sanerBarnepassSteg } from './sanerBarnepassSteg';
import { SettDokumentasjonsbehovBarn } from '../../../overgangsstønad/models/søknad';
import { ToggleName } from '../../../../models/søknad/toggles';
import { useToggles } from '../../../../context/TogglesContext';
import { useTidligereVedtak } from '../../../../context/TidligereVedtakContext';

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
    const { toggles } = useToggles();
    const { harTidligereVedtakStatus, harLøpendeBarnetilsynVedRegelendring2026 } =
      useTidligereVedtak();

    const [barn, settBarn] = useState(søknad.person.barn);
    const [søknadsdato, settSøknadsdato] = useState(søknad.søknadsdato);
    const [søkerFraBestemtMåned, settSøkerFraBestemtMåned] = useState(søknad.søkerFraBestemtMåned);

    const skalBrukeRegelendringer2026 =
      (harTidligereVedtakStatus !== 'JA' || !harLøpendeBarnetilsynVedRegelendring2026) &&
      toggles[ToggleName.overgangsstønadRegelendringer2026];

    const mellomlagreSteg = () => {
      const oppdatertSøknad = sanerBarnepassSteg(søknad, barn, søknadsdato, søkerFraBestemtMåned);

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
      skalBrukeRegelendringer2026,
      mellomlagreSteg,
      søknad,
      oppdaterSøknad,
      routes,
      pathOppsummering,
      settDokumentasjonsbehovForBarn,
    };
  }
);
