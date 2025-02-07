import LocaleTekst from '../../language/LocaleTekst';
import { useNavigate } from 'react-router-dom';
import { Button } from '@navikt/ds-react';
import FeltGruppe from '../gruppe/FeltGruppe';
import { ESkjemanavn } from '../../utils/skjemanavn';
import React from 'react';

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
}> = ({
  nesteSide,
  tekst = 'knapp.start',
  variant = 'primary',
  disabled = false,
}) => {
  const navigate = useNavigate();
  return (
    <FeltGruppe classname={'sentrert'} aria-live="polite">
      <Button
        onClick={() => {
          navigate(nesteSide);
        }}
        variant={variant}
        disabled={disabled}
      >
        <LocaleTekst tekst={tekst} />
      </Button>
    </FeltGruppe>
  );
};
