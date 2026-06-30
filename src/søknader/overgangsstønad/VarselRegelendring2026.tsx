import React from 'react';
import { Alert, BodyLong, Heading } from '@navikt/ds-react';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { hentTekst } from '../../utils/teksthåndtering';

export const VarselRegelendring2026 = () => {
  const intl = useLokalIntlContext();

  return (
    <Alert variant="info">
      <Heading spacing size="small" level="3">
        {hentTekst('forside.overgangsstønad.varselRegelendring2026.tittel', intl)}
      </Heading>
      <BodyLong spacing>
        {hentTekst('forside.overgangsstønad.varselRegelendring2026.førsteAvsnitt', intl)}
      </BodyLong>
      <BodyLong spacing>
        {hentTekst('forside.overgangsstønad.varselRegelendring2026.andreAvsnitt', intl)}
      </BodyLong>
      <BodyLong spacing>
        {hentTekst('forside.overgangsstønad.varselRegelendring2026.tredjeAvsnitt', intl)}
      </BodyLong>
    </Alert>
  );
};
