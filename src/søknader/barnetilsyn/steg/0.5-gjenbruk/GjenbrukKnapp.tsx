import { useNavigate } from 'react-router-dom';
import { Button } from '@navikt/ds-react';
import FeltGruppe from '../../../../components/gruppe/FeltGruppe';
import React, { useContext } from 'react';
import { GjenbrukContext } from '../../../../context/GjenbrukContext';
import { EEventsnavn, logEvent } from '../../../../utils/amplitude';
import { ESkjemanavn } from '../../../../utils/skjemanavn';
import { hentTekst } from '../../../../utils/søknad';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';

export const GjenbrukKnapp: React.FC<{
  nesteSide: string;
}> = ({ nesteSide }) => {
  const navigate = useNavigate();
  const intl = useLokalIntlContext();
  const { settSkalGjenbrukeSøknad } = useContext(GjenbrukContext);

  const handleButtonClick = () => {
    logEvent(EEventsnavn.GjenbrukSøknad, {
      skjemanavn: ESkjemanavn.Barnetilsyn,
    });

    settSkalGjenbrukeSøknad(true);
    navigate(nesteSide);
  };

  return (
    <FeltGruppe classname={'sentrert'} aria-live="polite">
      <Button onClick={() => handleButtonClick()} variant="primary">
        {hentTekst('knapp.startGjenbruk', intl)}
      </Button>
    </FeltGruppe>
  );
};
