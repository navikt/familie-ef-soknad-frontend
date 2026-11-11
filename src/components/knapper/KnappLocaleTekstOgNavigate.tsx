import { Button, VStack } from '@navikt/ds-react';
import type React from 'react';
import { useNavigate } from 'react-router';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import type { ESkjemanavn } from '../../utils/skjemanavn';
import { hentTekst } from '../../utils/teksthåndtering';

export const KnappLocaleTekstOgNavigate: React.FC<{
    nesteSide: string;
    tekst?: 'knapp.start' | 'knapp.neste' | 'knapp.startTom' | 'knapp.startGjenbruk' | 'knapp.tilbake' | 'knapp.avbryt';
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
