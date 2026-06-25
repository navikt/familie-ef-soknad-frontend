import React from 'react';
import { Alert, BodyLong, Heading } from '@navikt/ds-react';

export const VarselRegelendring2026 = () => {
  return (
    <Alert variant="info">
      <Heading spacing size="small" level="3">
        Endringer i stønadene til enslig mor eller far fra 1. juli 2026
      </Heading>
      <BodyLong spacing>
        Stortinget har vedtatt endringer i stønadene til enslig mor eller far . Endringene innebærer
        at overgangsstønad og andre stønader knyttet til det å være enslig mor eller far blir faset
        ut for hovedgruppen av mottakere.
      </BodyLong>
      <BodyLong spacing>
        I en overgangsfase gjelder 2 ulike regelverk for overgangsstønad. Hvilket regelverk som
        gjelder for deg , avhenger av om du har hatt stønad til enslig mor eller far tidligere, og
        om du har stønadstid til gode.
      </BodyLong>
      <BodyLong spacing>
        Noen av spørsmålene du får i søknaden blir bestemt ut fra om du har fått overgangsstønad
        tidligere. Uansett hvilke spørsmål du får, vil Nav vurdere hvilket regelverk som gjelder for
        deg. Hvis vi trenger flere opplysninger fra deg, vil vi gi deg beskjed om dette.
      </BodyLong>
    </Alert>
  );
};
