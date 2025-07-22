import { useNavigate } from 'react-router-dom';
import { Button } from '@navikt/ds-react';
import FeltGruppe from '../gruppe/FeltGruppe';
import { ESkjemanavn } from '../../utils/skjemanavn';
import { EEventsnavn, logEvent } from '../../utils/amplitude';
import React from 'react';
import { hentTekst } from '../../utils/søknad';
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
  logEventNavn?: EEventsnavn;
  skjemanavn?: ESkjemanavn;
}> = ({
  nesteSide,
  tekst = 'knapp.start',
  variant = 'primary',
  disabled = false,
  logEventNavn,
  skjemanavn,
}) => {
  const navigate = useNavigate();
  const intl = useLokalIntlContext();
  return (
    <FeltGruppe classname={'sentrert'} aria-live="polite">
      <Button
        onClick={() => {
          if (logEventNavn && skjemanavn) {
            logEvent(logEventNavn, { skjemanavn });
          }
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
