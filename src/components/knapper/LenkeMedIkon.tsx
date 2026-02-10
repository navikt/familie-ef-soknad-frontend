import React from 'react';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { BodyShort, Button, HStack } from '@navikt/ds-react';
import { hentHTMLTekst } from '../../utils/teksthåndtering';

interface Props {
  onClick: () => void;
  tekst_id: string;
  ikon: string;
}

export const LenkeMedIkon: React.FC<Props> = ({ onClick, tekst_id, ikon }) => {
  const intl = useLokalIntlContext();

  return (
    <HStack align={'start'}>
      <Button variant={'tertiary'} onClick={onClick} style={{ textDecoration: 'underline' }}>
        <HStack gap={'space-16'}>
          <img alt="Endre informasjon" src={ikon} />
          <BodyShort>{hentHTMLTekst(tekst_id, intl)}</BodyShort>
        </HStack>
      </Button>
    </HStack>
  );
};
