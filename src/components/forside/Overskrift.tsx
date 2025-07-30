import { hentTekst } from '../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { Heading } from '@navikt/ds-react';
import React from 'react';

export const Overskrift: React.FC<{ tekst: string }> = ({ tekst }) => {
  const intl = useLokalIntlContext();
  return (
    <Heading level="2" size="small">
      {hentTekst(tekst, intl)}
    </Heading>
  );
};
