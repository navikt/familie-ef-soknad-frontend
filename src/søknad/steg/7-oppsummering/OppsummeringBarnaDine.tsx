import React from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import endre from '../../../assets/endre.svg';
import { useLokalIntlContext } from '../../../context/LokalIntlContext';
import LenkeMedIkon from '../../../components/knapper/LenkeMedIkon';
import { hentTekst } from '../../../utils/søknad';
import { IBarn } from '../../../models/steg/barn';
import OppsummeringBarn from './OppsummeringBarn';
import { Stønadstype } from '../../../models/søknad/stønadstyper';
import BarneHeader from '../../../components/BarneHeader';
import KomponentGruppe from '../../../components/gruppe/KomponentGruppe';
import { StyledOppsummeringForBarn } from '../../../components/stegKomponenter/StyledOppsummering';
import { useNavigate } from 'react-router-dom';
import { Heading } from '@navikt/ds-react';

interface Props {
  barn: IBarn[];
  stønadstype: Stønadstype;
  endreInformasjonPath?: string;
  tittel: string;
}

const OppsummeringBarnaDine: React.FC<Props> = ({
  barn,
  stønadstype,
  endreInformasjonPath,
  tittel,
}) => {
  const intl = useLokalIntlContext();
  const navigate = useNavigate();
  const barnaDine: IBarn[] = barn;

  const hentEndretBarn = (barn: IBarn): IBarn => {
    let nyttBarn = { ...barn };

    if (barn && !barn?.født?.verdi) {
      // @ts-ignore
      delete nyttBarn?.ident;
      // @ts-ignore
      delete nyttBarn.navn;
      // @ts-ignore
      delete nyttBarn.alder;

      nyttBarn.fødselsdato = {
        label: hentTekst('barnadine.termindato', intl),
        verdi: barn.fødselsdato.verdi,
      };
    }
    return nyttBarn;
  };
  const oppsummeringBarnaDine = barnaDine.map((barn) => {
    const endretBarn = hentEndretBarn(barn);

    return (
      <StyledOppsummeringForBarn key={barn.id}>
        <BarneHeader barn={barn} />
        <OppsummeringBarn stønadstype={stønadstype} barn={endretBarn} />
      </StyledOppsummeringForBarn>
    );
  });

  return (
    <Ekspanderbartpanel
      tittel={
        <Heading level="3" size="small">
          {tittel}
        </Heading>
      }
    >
      <KomponentGruppe>{oppsummeringBarnaDine}</KomponentGruppe>
      <LenkeMedIkon
        onClick={() =>
          navigate(
            { pathname: endreInformasjonPath },
            { state: { kommerFraOppsummering: true } }
          )
        }
        tekst_id="barnasbosted.knapp.endre"
        ikon={endre}
      />
    </Ekspanderbartpanel>
  );
};

export default OppsummeringBarnaDine;
