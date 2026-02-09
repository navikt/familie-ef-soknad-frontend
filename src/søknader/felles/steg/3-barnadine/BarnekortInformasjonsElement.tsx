import React from 'react';
import { BodyShort, Label, VStack } from '@navikt/ds-react';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../utils/teksthåndtering';

interface Props {
  forklaringId: string;
  verdi: string | null;
}

export const InformasjonsElement: React.FC<Props> = ({ forklaringId, verdi }) => {
  const intl = useLokalIntlContext();

  return (
    <VStack gap="space-4">
      <Label size="small">{hentTekst(forklaringId, intl)}</Label>
      <BodyShort>{verdi}</BodyShort>
    </VStack>
  );
};
