import React from 'react';
import endre from '../../../../assets/endre.svg';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import LenkeMedIkon from '../../../../components/knapper/LenkeMedIkon';
import { hentTekst } from '../../../../utils/søknad';
import { IBarn } from '../../../../models/steg/barn';
import OppsummeringBarn from './OppsummeringBarn';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import BarneHeader from '../../../../components/BarneHeader';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import { StyledOppsummeringForBarn } from '../../../../components/stegKomponenter/StyledOppsummering';
import { useNavigate } from 'react-router-dom';

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
  const intl = useLokalIntlContext();
  const navigate = useNavigate();
  const barnaDine: IBarn[] = barn;

  const hentEndretBarn = (barn: IBarn): IBarn => {
    const nyttBarn = { ...barn };

    if (barn && !barn?.født?.verdi) {
      // @ts-expect-error sletting
      delete nyttBarn?.ident;
      // @ts-expect-error sletting
      delete nyttBarn.navn;
      // @ts-expect-error sletting
      delete nyttBarn.alder;

      nyttBarn.fødselsdato = {
        label: hentTekst('barnadine.termindato', intl),
        verdi: barn.fødselsdato.verdi,
      };
    }
    return nyttBarn;
  };
  const oppsummeringBarnaDine = barnaDine
    .filter((barn) =>
      stønadstype == Stønadstype.barnetilsyn
        ? barn.skalHaBarnepass?.verdi
        : true
    )
    .map((barn) => {
      const endretBarn = hentEndretBarn(barn);

      return (
        <StyledOppsummeringForBarn key={barn.id}>
          <BarneHeader barn={barn} />
          <OppsummeringBarn stønadstype={stønadstype} barn={endretBarn} />
        </StyledOppsummeringForBarn>
      );
    });

  return (
    <>
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
    </>
  );
};

export default OppsummeringBarnaDine;
