import React from 'react';
import endre from '../../../../assets/endre.svg';
import LenkeMedIkon from '../../../../components/knapper/LenkeMedIkon';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { IAktivitet } from '../../../../models/steg/aktivitet/aktivitet';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import {
  VisLabelOgSvar,
  visLabelOgVerdiForSpørsmålFelt,
  visLabelOgVerdiForSpørsmålListeFelt,
  visListeAvLabelOgSvar,
} from '../../../../utils/visning';
import {
  SeksjonSpacingBottom,
  SeksjonSpacingTop,
  StyledOppsummeringMedUndertitler,
} from '../../../../components/stegKomponenter/StyledOppsummering';
import { useNavigate } from 'react-router-dom';
import { Ingress } from '@navikt/ds-react';

interface Props {
  aktivitet: IAktivitet;
  endreInformasjonPath?: string;
}

const OppsummeringAktiviteter: React.FC<Props> = ({ aktivitet, endreInformasjonPath }) => {
  const navigate = useNavigate();
  const intl = useLokalIntlContext();

  return (
    <StyledOppsummeringMedUndertitler>
      {aktivitet.erIArbeid && visLabelOgVerdiForSpørsmålFelt(aktivitet?.erIArbeid, intl)}

      {aktivitet.hvaErDinArbeidssituasjon && (
        <SeksjonSpacingBottom>
          {visLabelOgVerdiForSpørsmålListeFelt(aktivitet.hvaErDinArbeidssituasjon)}
        </SeksjonSpacingBottom>
      )}

      {aktivitet.etablererEgenVirksomhet && (
        <SeksjonSpacingBottom>
          {visLabelOgVerdiForSpørsmålFelt(
            aktivitet.etablererEgenVirksomhet,
            intl,
            hentTekst('arbeidssituasjon.tittel.etablererEgenVirksomhet', intl)
          )}
        </SeksjonSpacingBottom>
      )}

      {aktivitet.arbeidsforhold && (
        <SeksjonSpacingBottom>
          {visListeAvLabelOgSvar(
            aktivitet.arbeidsforhold,
            hentTekst('arbeidsforhold.tittel.arbeidsgiver', intl)
          )}
        </SeksjonSpacingBottom>
      )}

      {aktivitet.firmaer && (
        <SeksjonSpacingBottom>
          {visListeAvLabelOgSvar(aktivitet.firmaer, hentTekst('firmaer.tittel', intl))}
        </SeksjonSpacingBottom>
      )}

      {aktivitet.egetAS && (
        <SeksjonSpacingBottom>
          {visListeAvLabelOgSvar(aktivitet.egetAS, hentTekst('arbeidsforhold.tittel.egetAS', intl))}
        </SeksjonSpacingBottom>
      )}

      {aktivitet.arbeidssøker && (
        <SeksjonSpacingBottom>
          <Ingress>{hentTekst('arbeidssøker.tittel', intl)}</Ingress>
          {VisLabelOgSvar(aktivitet.arbeidssøker)}
        </SeksjonSpacingBottom>
      )}

      {aktivitet.underUtdanning && (
        <SeksjonSpacingBottom>
          <Ingress>{hentTekst('utdanning.tittel', intl)}</Ingress>
          {VisLabelOgSvar(aktivitet.underUtdanning)}
          {aktivitet.underUtdanning?.tidligereUtdanning && (
            <SeksjonSpacingTop>
              {visListeAvLabelOgSvar(
                aktivitet.underUtdanning.tidligereUtdanning,
                hentTekst('utdanning.tittel.tidligere', intl)
              )}
            </SeksjonSpacingTop>
          )}
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

export default OppsummeringAktiviteter;
