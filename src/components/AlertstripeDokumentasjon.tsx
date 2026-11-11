import { FileTextIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack } from '@navikt/ds-react';
import type React from 'react';
import type { FC } from 'react';

export const AlertStripeDokumentasjon: FC<{ children?: React.ReactNode }> = ({ children }) => {
    return (
        <HStack gap="space-8" paddingBlock="space-16" wrap={false}>
            <FileTextIcon title="fil-ikon" fontSize="2rem" style={{ flexShrink: 0 }} />
            <BodyShort size={'small'}>{children}</BodyShort>
        </HStack>
    );
};
