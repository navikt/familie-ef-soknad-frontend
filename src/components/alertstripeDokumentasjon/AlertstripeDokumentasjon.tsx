import React, { FC } from 'react';
import { BodyShort, HStack } from '@navikt/ds-react';
import { FileTextIcon } from '@navikt/aksel-icons';

export const AlertStripeDokumentasjon: FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <HStack gap="2" align="center" paddingBlock="4">
      <FileTextIcon title="a11y-title" fontSize="2rem" />
      <BodyShort size={'small'}>{children}</BodyShort>
    </HStack>
  );
};
