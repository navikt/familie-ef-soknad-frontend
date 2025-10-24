import { useNavigate } from 'react-router-dom';
import { Button, VStack } from '@navikt/ds-react';
import { ESkjemanavn } from '../../utils/skjemanavn';
import React from 'react';
import { hentTekst } from '../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../context/LokalIntlContext';

export const KnappLocaleTekstOgNavigate: React.FC<{
  nesteSide: string;
  tekst?:
    | 'knapp.start'
    | 'knapp.neste'
    | 'knapp.startTom'
    | 'knapp.startGjenbruk'
    | 'knapp.tilbake'
    | 'knapp.avbryt';
  variant?: 'primary' | 'secondary' | 'tertiary';
  disabled?: boolean;
  skjemanavn?: ESkjemanavn;
}> = ({ nesteSide, tekst = 'knapp.start', variant = 'primary', disabled = false }) => {
  const navigate = useNavigate();
  const intl = useLokalIntlContext();
  return (
    <VStack align={'center'}>
      <div>
        <Button
          onClick={() => {
            navigate(nesteSide);
          }}
          variant={variant}
          disabled={disabled}
        >
          {hentTekst(tekst, intl)}
        </Button>
      </div>
    </VStack>
  );
};
