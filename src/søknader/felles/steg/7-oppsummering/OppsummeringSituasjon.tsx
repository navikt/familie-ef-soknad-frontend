import React from 'react';
import endre from '../../../../assets/endre.svg';
import { LenkeMedIkon } from '../../../../components/knapper/LenkeMedIkon';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import {
  VisLabelOgSvar,
  visLabelOgVerdiForSpørsmålFelt,
  visLabelOgVerdiForSpørsmålListeFelt,
  visListeAvLabelOgSvar,
} from '../../../../utils/visning';
import { StyledOppsummeringMedUndertitler } from '../../../../components/stegKomponenter/StyledOppsummering';
import { useNavigate } from 'react-router-dom';
import { IDinSituasjon } from '../../../../models/steg/dinsituasjon/meromsituasjon';
import { IAktivitet } from '../../../../models/steg/aktivitet/aktivitet';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { ITekstFelt } from '../../../../models/søknad/søknadsfelter';
import { VStack } from '@navikt/ds-react';

interface Props {
  dinSituasjon: IDinSituasjon;
  aktivitet: IAktivitet;
  endreInformasjonPath?: string;
  barnMedsærligeTilsynsbehov: (ITekstFelt | undefined)[];
}

export const OppsummeringSituasjon: React.FC<Props> = ({
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
      <VStack gap={'space-16'}>
        {dinSituasjon.hvaSituasjon && (
          <div>{visLabelOgVerdiForSpørsmålListeFelt(dinSituasjon.hvaSituasjon)}</div>
        )}

        {Object.keys(barnMedsærligeTilsynsbehovlabelOgSvar).length > 0 && (
          <div>{VisLabelOgSvar(barnMedsærligeTilsynsbehovlabelOgSvar)}</div>
        )}

        {dinSituasjon.inntekter && (
          <div>{visLabelOgVerdiForSpørsmålListeFelt(dinSituasjon.inntekter)}</div>
        )}

        {aktivitet.firmaer && (
          <div>{visListeAvLabelOgSvar(aktivitet.firmaer, hentTekst('firmaer.tittel', intl))}</div>
        )}

        {dinSituasjon.sagtOppEllerRedusertStilling &&
          visLabelOgVerdiForSpørsmålFelt(dinSituasjon.sagtOppEllerRedusertStilling, intl)}

        {dinSituasjon.begrunnelseSagtOppEllerRedusertStilling && (
          <div>
            {VisLabelOgSvar({ begrunnelse: dinSituasjon.begrunnelseSagtOppEllerRedusertStilling })}
          </div>
        )}

        {dinSituasjon.datoSagtOppEllerRedusertStilling && (
          <div>{VisLabelOgSvar({ dato: dinSituasjon.datoSagtOppEllerRedusertStilling })}</div>
        )}

        {dinSituasjon.søkerFraBestemtMåned &&
          visLabelOgVerdiForSpørsmålFelt(dinSituasjon.søkerFraBestemtMåned, intl)}

        {dinSituasjon.søknadsdato && (
          <div>{VisLabelOgSvar({ søknadsdato: dinSituasjon.søknadsdato })}</div>
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
      </VStack>
    </StyledOppsummeringMedUndertitler>
  );
};
