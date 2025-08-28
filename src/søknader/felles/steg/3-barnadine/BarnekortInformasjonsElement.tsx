import React from 'react';
import { BodyShort, Label, VStack } from '@navikt/ds-react';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../utils/teksthåndtering';

export const InformasjonsElement: React.FC<{
  forklaringId: string;
  verdi: string | null;
}> = ({ forklaringId, verdi }) => {
  const intl = useLokalIntlContext();

  return (
    <VStack gap="1">
      <Label size="small">{hentTekst(forklaringId, intl)}</Label>
      <BodyShort>{verdi}</BodyShort>
    </VStack>
  );
};
