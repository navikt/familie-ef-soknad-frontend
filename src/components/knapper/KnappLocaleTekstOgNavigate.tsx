import { useNavigate } from 'react-router-dom';
import { Button } from '@navikt/ds-react';
import FeltGruppe from '../gruppe/FeltGruppe';
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
    <FeltGruppe classname={'sentrert'} aria-live="polite">
      <Button
        onClick={() => {
          navigate(nesteSide);
        }}
        variant={variant}
        disabled={disabled}
      >
        {hentTekst(tekst, intl)}
      </Button>
    </FeltGruppe>
  );
};
