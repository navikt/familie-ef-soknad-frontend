import React from 'react';
import { BodyShort, Label } from '@navikt/ds-react';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';

export const InformasjonsElement: React.FC<{
  forklaringId: string;
  verdi: string | null;
}> = ({ forklaringId, verdi }) => {
  const intl = useLokalIntlContext();

  return (
    <div>
      <Label size="small">{intl.formatMessage({ id: forklaringId })}</Label>
      <BodyShort>{verdi}</BodyShort>
    </div>
  );
};
