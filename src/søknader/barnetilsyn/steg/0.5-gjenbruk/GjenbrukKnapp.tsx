import { useNavigate } from 'react-router-dom';
import { Button, VStack } from '@navikt/ds-react';
import React, { useContext } from 'react';
import { GjenbrukContext } from '../../../../context/GjenbrukContext';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';

export const GjenbrukKnapp: React.FC<{
  nesteSide: string;
}> = ({ nesteSide }) => {
  const navigate = useNavigate();
  const intl = useLokalIntlContext();
  const { settSkalGjenbrukeSøknad } = useContext(GjenbrukContext);

  const handleButtonClick = () => {
    settSkalGjenbrukeSøknad(true);
    navigate(nesteSide);
  };

  return (
    <VStack align={'center'}>
      <div>
        <Button onClick={() => handleButtonClick()} variant="primary">
          {hentTekst('knapp.startGjenbruk', intl)}
        </Button>
      </div>
    </VStack>
  );
};
