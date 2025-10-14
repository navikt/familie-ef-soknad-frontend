import React, { FC } from 'react';
import { BodyShort, HStack } from '@navikt/ds-react';
import { FileTextIcon } from '@navikt/aksel-icons';

export const AlertStripeDokumentasjon: FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <HStack gap="2" paddingBlock="4" wrap={false}>
      <FileTextIcon title="fil-ikon" fontSize="2rem" style={{ flexShrink: 0 }} />
      <BodyShort size={'small'}>{children}</BodyShort>
    </HStack>
  );
};
