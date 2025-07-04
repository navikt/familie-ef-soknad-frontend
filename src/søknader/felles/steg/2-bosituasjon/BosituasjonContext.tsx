import constate from 'constate';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { MellomlagretSøknad, Søknad } from '../../../../models/søknad/søknad';
import { IRoute } from '../../../../models/routes';
import { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import { sanerBosituasjonSteg } from './sanering';
import { IBosituasjon } from '../../../../models/steg/bosituasjon';
import { hentTekst } from '../../../../utils/søknad';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { delerSøkerBoligMedAndreVoksne } from './BosituasjonConfig';

interface Props<T extends Søknad> {
  stønadstype: Stønadstype;
  søknad: T;
  oppdaterSøknad: (søknad: T) => void;
  mellomlagretSøknad: MellomlagretSøknad | undefined;
  mellomlagreSøknad: (steg: string, oppdatertSøknad: T) => void;
  routes: IRoute[];
  pathOppsummering: string | undefined;
  settDokumentasjonsbehov: (spørsmål: ISpørsmål, valgtSvar: ISvar, erHuketAv?: boolean) => void;
}

export const [BosituasjonProvider, useBosituasjon] = constate(
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
    const intl = useLokalIntlContext();

    const [bosituasjon, settBosituasjon] = useState<IBosituasjon>(søknad.bosituasjon);

    const hovedSpørsmål: ISpørsmål = delerSøkerBoligMedAndreVoksne(intl);

    const mellomlagreSteg = () => {
      const oppdatertSøknad = sanerBosituasjonSteg(søknad, bosituasjon);

      oppdaterSøknad(oppdatertSøknad);

      return mellomlagreSøknad(location.pathname, oppdatertSøknad);
    };

    const oppdaterDelerBoligMedAndreVoksne = (spørsmål: ISpørsmål, svar: ISvar) => {
      const svarTekst: string = svar.svar_tekst;
      const spørsmålTekst: string = hentTekst(spørsmål.tekstid, intl);

      const nyBosituasjon = {
        delerBoligMedAndreVoksne: {
          spørsmålid: spørsmål.søknadid,
          svarid: svar.id,
          label: spørsmålTekst,
          verdi: svarTekst,
        },
      };

      settBosituasjon(nyBosituasjon);
      settDokumentasjonsbehov(spørsmål, svar);
    };

    return {
      stønadstype,
      bosituasjon,
      routes,
      pathOppsummering,
      settDokumentasjonsbehov,
      settBosituasjon,
      mellomlagreSteg,
      oppdaterDelerBoligMedAndreVoksne,
      hovedSpørsmål,
    };
  }
);
