import React from 'react';
import { Alert, BodyLong, Heading } from '@navikt/ds-react';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { hentTekst } from '../../utils/teksthåndtering';
import { Stønadstype } from '../../models/søknad/stønadstyper';

interface Props {
  stønadstype: Stønadstype;
}

export const VarselRegelendring2026 = (props: Props) => {
  const intl = useLokalIntlContext();

  const tittelNøkkel =
    props.stønadstype == Stønadstype.overgangsstønad
      ? 'forside.overgangsstønad.varselRegelendring2026.tittel'
      : 'forside.barnetilsyn.varselRegelendring2026.tittel';
  const førsteAvsnittNøkkel =
    props.stønadstype == Stønadstype.overgangsstønad
      ? 'forside.overgangsstønad.varselRegelendring2026.førsteAvsnitt'
      : 'forside.barnetilsyn.varselRegelendring2026.førsteAvsnitt';
  const andreAvsnittNøkkel =
    props.stønadstype == Stønadstype.overgangsstønad
      ? 'forside.overgangsstønad.varselRegelendring2026.andreAvsnitt'
      : 'forside.barnetilsyn.varselRegelendring2026.andreAvsnitt';
  const tredjeAvsnittNøkkel =
    props.stønadstype == Stønadstype.overgangsstønad
      ? 'forside.overgangsstønad.varselRegelendring2026.tredjeAvsnitt'
      : 'forside.barnetilsyn.varselRegelendring2026.tredjeAvsnitt';

  return (
    <Alert variant="info">
      <Heading spacing size="small" level="3">
        {hentTekst(tittelNøkkel, intl)}
      </Heading>
      <BodyLong spacing>{hentTekst(førsteAvsnittNøkkel, intl)}</BodyLong>
      <BodyLong spacing>{hentTekst(andreAvsnittNøkkel, intl)}</BodyLong>
      <BodyLong spacing>{hentTekst(tredjeAvsnittNøkkel, intl)}</BodyLong>
    </Alert>
  );
};
