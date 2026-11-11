import { PlusCircleFillIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import type React from 'react';

interface Props {
    onClick: () => void;
    children?: React.ReactNode;
}

const LeggTilKnapp: React.FC<Props> = ({ onClick, children }) => {
    return (
        <Button variant="tertiary" onClick={onClick} icon={<PlusCircleFillIcon />}>
            {children}
        </Button>
    );
};

export default LeggTilKnapp;
