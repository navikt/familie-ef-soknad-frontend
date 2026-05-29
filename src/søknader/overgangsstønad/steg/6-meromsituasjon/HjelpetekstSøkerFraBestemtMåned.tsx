import React from 'react';
import { VStack, BodyShort } from '@navikt/ds-react';
import { formatMånederTilbake, dagensDato } from '../../../../utils/dato';
import { hentTekstMedEnVariabel, hentTekst } from '../../../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';

export const HjelpetekstSøkerFraBestemtMåned: React.FC = () => {
  const intl = useLokalIntlContext();

  const hjelpetekstFørsteAvsnitt = hentTekstMedEnVariabel(
    'søkerFraBestemtMåned.hjelpetekst-innhold.overgangsstønad-del1',
    intl,
    formatMånederTilbake(dagensDato, 3)
  );
  const hjelpetekstAndreAvsnitt = hentTekstMedEnVariabel(
    'søkerFraBestemtMåned.hjelpetekst-innhold.overgangsstønad-del2',
    intl,
    formatMånederTilbake(dagensDato, 5)
  );
  const hjelpetekstTredjeAvsnitt = hentTekst(
    'søkerFraBestemtMåned.hjelpetekst-innhold.overgangsstønad-del3',
    intl
  );

  return (
    <VStack gap={'space-16'}>
      <BodyShort>{hjelpetekstFørsteAvsnitt}</BodyShort>
      <BodyShort>{hjelpetekstAndreAvsnitt}</BodyShort>
      <BodyShort>{hjelpetekstTredjeAvsnitt}</BodyShort>
    </VStack>
  );
};
