import React from 'react';
import endre from '../../../../assets/endre.svg';
import { LenkeMedIkon } from '../../../../components/knapper/LenkeMedIkon';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { IAktivitet } from '../../../../models/steg/aktivitet/aktivitet';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import {
  VisLabelOgSvar,
  visLabelOgVerdiForSpørsmålFelt,
  visLabelOgVerdiForSpørsmålListeFelt,
  visListeAvLabelOgSvar,
} from '../../../../utils/visning';
import { useNavigate } from 'react-router-dom';
import { Ingress, VStack } from '@navikt/ds-react';
import styles from './OppsummeringAktiviteter.module.css';

interface Props {
  aktivitet: IAktivitet;
  endreInformasjonPath?: string;
}

const OppsummeringAktiviteter: React.FC<Props> = ({ aktivitet, endreInformasjonPath }) => {
  const navigate = useNavigate();
  const intl = useLokalIntlContext();

  return (
    <div className={styles.oppsummeringMedUndertitler}>
      <VStack gap={'space-16'}>
        {aktivitet.erIArbeid && visLabelOgVerdiForSpørsmålFelt(aktivitet?.erIArbeid, intl)}

        {aktivitet.hvaErDinArbeidssituasjon &&
          visLabelOgVerdiForSpørsmålListeFelt(aktivitet.hvaErDinArbeidssituasjon)}

        {aktivitet.etablererEgenVirksomhet &&
          visLabelOgVerdiForSpørsmålFelt(
            aktivitet.etablererEgenVirksomhet,
            intl,
            hentTekst('arbeidssituasjon.tittel.etablererEgenVirksomhet', intl)
          )}

        {aktivitet.arbeidsforhold &&
          visListeAvLabelOgSvar(
            aktivitet.arbeidsforhold,
            hentTekst('arbeidsforhold.tittel.arbeidsgiver', intl)
          )}

        {aktivitet.firmaer &&
          visListeAvLabelOgSvar(aktivitet.firmaer, hentTekst('firmaer.tittel', intl))}

        {aktivitet.egetAS &&
          visListeAvLabelOgSvar(aktivitet.egetAS, hentTekst('arbeidsforhold.tittel.egetAS', intl))}

        {aktivitet.arbeidssøker && (
          <div>
            <Ingress>{hentTekst('arbeidssøker.tittel', intl)}</Ingress>
            {VisLabelOgSvar(aktivitet.arbeidssøker)}
          </div>
        )}

        {aktivitet.underUtdanning && (
          <VStack gap={'space-48'}>
            <div>
              <Ingress>{hentTekst('utdanning.tittel', intl)}</Ingress>
              {VisLabelOgSvar(aktivitet.underUtdanning)}
            </div>
            {aktivitet.underUtdanning?.tidligereUtdanning &&
              visListeAvLabelOgSvar(
                aktivitet.underUtdanning.tidligereUtdanning,
                hentTekst('utdanning.tittel.tidligere', intl)
              )}
          </VStack>
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
    </div>
  );
};

export default OppsummeringAktiviteter;
