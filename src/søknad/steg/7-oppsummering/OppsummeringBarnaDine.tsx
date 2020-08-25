import React from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import endre from '../../../assets/endre.svg';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import LenkeMedIkon from '../../../components/knapper/LenkeMedIkon';
import { hentTekst } from '../../../utils/søknad';
import { IBarn } from '../../../models/steg/barn';
import OppsummeringBarn from './OppsummeringBarn';
import { Stønadstype } from '../../../models/søknad/stønadstyper';
import BarneHeader from '../../../components/BarneHeader';
import styled from 'styled-components';
import EkspanderbarOppsummering from '../../../components/stegKomponenter/EkspanderbarOppsummering';
import KomponentGruppe from '../../../components/gruppe/KomponentGruppe';

const StyledOppsummering = styled.section`
  margin-top: 3rem;

  .typo-element {
    margin-top: 2rem;
    margin-bottom: 1rem;
  }
`;

interface Props {
  barn: IBarn[];
  stønadstype: Stønadstype;
  endreInformasjonPath?: string;
}
const OppsummeringBarnaDine: React.FC<Props> = ({
  barn,
  stønadstype,
  endreInformasjonPath,
}) => {
  const intl = useIntl();
  const history = useHistory();
  const barnaDine: IBarn[] = barn;

  const hentEndretBarn = (barn: IBarn) => {
    let nyttBarn = { ...barn };

    if (!barn.født?.verdi) {
      delete nyttBarn.ident;
      delete nyttBarn.navn;
      delete nyttBarn.alder;

      nyttBarn.fødselsdato = {
        label: hentTekst('barnadine.termindato', intl),
        verdi: barn.fødselsdato.verdi,
      };
    }
    return nyttBarn;
  };
  const oppsummeringBarnaDine = barnaDine.map((barn, index) => {
    const endretBarn = hentEndretBarn(barn);

    return (
      <StyledOppsummering>
        <BarneHeader barn={barn} />
        <OppsummeringBarn stønadstype={stønadstype} barn={endretBarn} />
      </StyledOppsummering>
    );
  });

  return (
    <Ekspanderbartpanel tittel={<Undertittel>Barna dine</Undertittel>}>
      <EkspanderbarOppsummering>
        <KomponentGruppe>{oppsummeringBarnaDine}</KomponentGruppe>
        <LenkeMedIkon
          onClick={() =>
            history.push({
              pathname: endreInformasjonPath,
              state: { kommerFraOppsummering: true },
            })
          }
          tekst_id="barnasbosted.knapp.endre"
          ikon={endre}
        />
      </EkspanderbarOppsummering>
    </Ekspanderbartpanel>
  );
};

export default OppsummeringBarnaDine;
