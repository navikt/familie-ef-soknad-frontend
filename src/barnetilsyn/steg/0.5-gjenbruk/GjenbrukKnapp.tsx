import LocaleTekst from '../../../language/LocaleTekst';
import { useNavigate } from 'react-router-dom';
import { Button } from '@navikt/ds-react';
import FeltGruppe from '../../../components/gruppe/FeltGruppe';
import React, { useContext } from 'react';
import { GjenbrukContext } from '../../../context/GjenbrukContext';

export const GjenbrukKnapp: React.FC<{
  nesteSide: string;
}> = ({ nesteSide }) => {
  const navigate = useNavigate();
  const { settSkalGjenbrukeSøknad } = useContext(GjenbrukContext);

  const handleButtonClick = () => {
    settSkalGjenbrukeSøknad(true);
    navigate(nesteSide);
  };

  return (
    <FeltGruppe classname={'sentrert'} aria-live="polite">
      <Button onClick={() => handleButtonClick()} variant="primary">
        <LocaleTekst tekst={'knapp.startGjenbruk'} />
      </Button>
    </FeltGruppe>
  );
};
