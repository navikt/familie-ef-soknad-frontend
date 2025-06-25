import React from 'react';
import { VisLabelOgSvar } from '../../../../utils/visning';
import endre from '../../../../assets/endre.svg';
import LenkeMedIkon from '../../../../components/knapper/LenkeMedIkon';
import { IDinSituasjon } from '../../../../models/steg/dinsituasjon/meromsituasjon';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import { StyledOppsummering } from '../../../../components/stegKomponenter/StyledOppsummering';
import { ITekstFelt } from '../../../../models/søknad/søknadsfelter';
import { useNavigate } from 'react-router-dom';

interface Props {
  dinSituasjon: IDinSituasjon;
  endreInformasjonPath?: string;
  barnMedsærligeTilsynsbehov: (ITekstFelt | undefined)[];
  tittel: string;
}

const OppsummeringDinSituasjon: React.FC<Props> = ({
  dinSituasjon,
  endreInformasjonPath,
  barnMedsærligeTilsynsbehov,
}) => {
  const navigate = useNavigate();

  const { gjelderDetteDeg, ...rest } = dinSituasjon;

  const barnMedsærligeTilsynsbehovlabelOgSvar = barnMedsærligeTilsynsbehov.reduce(
    (acc, val, idx) => {
      acc[`barnMedsærligeTilsynsbehov${idx}`] = val;
      return acc;
    },
    {} as any
  );

  return (
    <>
      <StyledOppsummering>
        <KomponentGruppe>
          {VisLabelOgSvar({
            gjelderDetteDeg,
            ...barnMedsærligeTilsynsbehovlabelOgSvar,
            ...rest,
          })}
        </KomponentGruppe>
        <LenkeMedIkon
          onClick={() =>
            navigate({ pathname: endreInformasjonPath }, { state: { kommerFraOppsummering: true } })
          }
          tekst_id="barnasbosted.knapp.endre"
          ikon={endre}
        />
      </StyledOppsummering>
    </>
  );
};

export default OppsummeringDinSituasjon;
