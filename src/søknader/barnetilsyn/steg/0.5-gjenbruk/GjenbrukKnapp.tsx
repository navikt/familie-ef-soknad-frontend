import { Button, VStack } from '@navikt/ds-react';
import type React from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router';
import { GjenbrukContext } from '../../../../context/GjenbrukContext';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../utils/teksthåndtering';

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
