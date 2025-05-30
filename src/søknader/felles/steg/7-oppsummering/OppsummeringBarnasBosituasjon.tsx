import { FC } from 'react';
import endre from '../../../../assets/endre.svg';
import LenkeMedIkon from '../../../../components/knapper/LenkeMedIkon';
import { IBarn } from '../../../../models/steg/barn';
import { VisLabelOgSvar } from '../../../../utils/visning';
import BarneHeader from '../../../../components/BarneHeader';
import { StyledOppsummeringForBarn } from '../../../../components/stegKomponenter/StyledOppsummering';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import { hentTekst } from '../../../../utils/søknad';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { useNavigate } from 'react-router-dom';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';

interface Props {
  barn: IBarn[];
  endreInformasjonPath?: string;
  stønadstype: Stønadstype;
}

const OppsummeringBarnasBosituasjon: FC<Props> = ({
  barn,
  endreInformasjonPath,
  stønadstype,
}) => {
  const navigate = useNavigate();
  const intl = useLokalIntlContext();

  const felterAlleForeldrene = barn
    .filter((barn) =>
      stønadstype == Stønadstype.barnetilsyn
        ? barn.skalHaBarnepass?.verdi
        : true
    )
    .map((barn) => {
      if (!barn.forelder) return null;

      const visningsIdent = barn.forelder.fraFolkeregister
        ? undefined
        : barn.forelder.ident;

      const visningForelder = {
        ...barn.forelder,
        navn: {
          label: hentTekst('barnasbosted.oppsummering.navn.label', intl),
          verdi: barn.forelder?.navn?.verdi,
        },
        ident: visningsIdent,
      };

      delete visningForelder.hvorforIkkeOppgi;
      delete visningForelder.kanIkkeOppgiAnnenForelderFar;

      const barnetsNavn =
        barn.født?.verdi && barn.navn.verdi
          ? barn.navn.verdi
          : hentTekst('barnet.litenForBokstav', intl);

      const forelderFelter = VisLabelOgSvar(visningForelder, barnetsNavn);

      return (
        <StyledOppsummeringForBarn key={barn.id}>
          <BarneHeader barn={barn} />
          {forelderFelter}
        </StyledOppsummeringForBarn>
      );
    });

  return (
    <>
      <KomponentGruppe>{felterAlleForeldrene}</KomponentGruppe>
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

export default OppsummeringBarnasBosituasjon;
