import React from 'react';
import endre from '../../../../assets/endre.svg';
import { LenkeMedIkon } from '../../../../components/knapper/LenkeMedIkon';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import {
  visLabelOgVerdiForSpørsmålFelt,
  visLabelOgVerdiForSpørsmålListeFelt,
  visListeAvLabelOgSvar,
  VisLabelOgSvar,
} from '../../../../utils/visning';
import {
  SeksjonSpacingBottom,
  StyledOppsummeringMedUndertitler,
} from '../../../../components/stegKomponenter/StyledOppsummering';
import { useNavigate } from 'react-router-dom';
import { IDinSituasjon } from '../../../../models/steg/dinsituasjon/meromsituasjon';
import { IAktivitet } from '../../../../models/steg/aktivitet/aktivitet';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { ITekstFelt } from '../../../../models/søknad/søknadsfelter';

interface Props {
  dinSituasjon: IDinSituasjon;
  aktivitet: IAktivitet;
  endreInformasjonPath?: string;
  barnMedsærligeTilsynsbehov: (ITekstFelt | undefined)[];
}

const OppsummeringNySituasjon: React.FC<Props> = ({
  dinSituasjon,
  aktivitet,
  endreInformasjonPath,
  barnMedsærligeTilsynsbehov,
}) => {
  const navigate = useNavigate();
  const intl = useLokalIntlContext();

  const barnMedsærligeTilsynsbehovlabelOgSvar = barnMedsærligeTilsynsbehov.reduce(
    (acc, val, idx) => {
      acc[`barnMedsærligeTilsynsbehov${idx}`] = val;
      return acc;
    },
    {} as Record<string, ITekstFelt | undefined>
  );

  return (
    <StyledOppsummeringMedUndertitler>
      {dinSituasjon.hvaSituasjon && (
        <SeksjonSpacingBottom>
          {visLabelOgVerdiForSpørsmålListeFelt(dinSituasjon.hvaSituasjon)}
        </SeksjonSpacingBottom>
      )}

      {Object.keys(barnMedsærligeTilsynsbehovlabelOgSvar).length > 0 && (
        <SeksjonSpacingBottom>
          {VisLabelOgSvar(barnMedsærligeTilsynsbehovlabelOgSvar)}
        </SeksjonSpacingBottom>
      )}

      {dinSituasjon.inntekter && (
        <SeksjonSpacingBottom>
          {visLabelOgVerdiForSpørsmålListeFelt(dinSituasjon.inntekter)}
        </SeksjonSpacingBottom>
      )}

      {aktivitet.firmaer && (
        <SeksjonSpacingBottom>
          {visListeAvLabelOgSvar(aktivitet.firmaer, hentTekst('firmaer.tittel', intl))}
        </SeksjonSpacingBottom>
      )}

      {dinSituasjon.sagtOppEllerRedusertStilling &&
        visLabelOgVerdiForSpørsmålFelt(dinSituasjon.sagtOppEllerRedusertStilling, intl)}

      {dinSituasjon.begrunnelseSagtOppEllerRedusertStilling && (
        <SeksjonSpacingBottom>
          {VisLabelOgSvar({ begrunnelse: dinSituasjon.begrunnelseSagtOppEllerRedusertStilling })}
        </SeksjonSpacingBottom>
      )}

      {dinSituasjon.datoSagtOppEllerRedusertStilling && (
        <SeksjonSpacingBottom>
          {VisLabelOgSvar({ dato: dinSituasjon.datoSagtOppEllerRedusertStilling })}
        </SeksjonSpacingBottom>
      )}

      {dinSituasjon.søkerFraBestemtMåned &&
        visLabelOgVerdiForSpørsmålFelt(dinSituasjon.søkerFraBestemtMåned, intl)}

      {dinSituasjon.søknadsdato && (
        <SeksjonSpacingBottom>
          {VisLabelOgSvar({ søknadsdato: dinSituasjon.søknadsdato })}
        </SeksjonSpacingBottom>
      )}

      <LenkeMedIkon
        onClick={() =>
          navigate(
            { pathname: endreInformasjonPath },
            { state: { kommerFraOppsummering: true }, replace: true }
          )
        }
        tekst_id="barnasbosted.knapp.endre"
        ikon={endre}
      />
    </StyledOppsummeringMedUndertitler>
  );
};

export default OppsummeringNySituasjon;
