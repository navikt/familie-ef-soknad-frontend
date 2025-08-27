import { BodyShort, Box, Button, VStack } from '@navikt/ds-react';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import React from 'react';
import styles from './LeggTilBarnKort.module.css';

export const LeggTilBarnKort: React.FC<{
  settÅpenModal: (åpen: React.SetStateAction<boolean>) => void;
}> = ({ settÅpenModal }) => {
  const intl = useLokalIntlContext();

  return (
    <Box className={styles.container}>
      <VStack gap={'6'}>
        <BodyShort as="p">{hentTekst('barnadine.leggtil.info', intl)}</BodyShort>

        <Button
          data-testid="leggTilBarnKnapp"
          variant="secondary"
          onClick={() => settÅpenModal(true)}
        >
          {hentTekst('barnadine.leggtil', intl)}
        </Button>
      </VStack>
    </Box>
  );
};
