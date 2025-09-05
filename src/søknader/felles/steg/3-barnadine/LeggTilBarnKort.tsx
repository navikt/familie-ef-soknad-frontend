import { BodyShort, Box, Button } from '@navikt/ds-react';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import React from 'react';
import styles from './LeggTilBarnKort.module.css';

interface Props {
  settÅpenModal: (åpen: boolean) => void;
}

export const LeggTilBarnKort: React.FC<Props> = ({ settÅpenModal }) => {
  const intl = useLokalIntlContext();

  return (
    <Box className={styles.kortContainer}>
      <BodyShort>{hentTekst('barnadine.leggtil.info', intl)}</BodyShort>
      <Button
        data-testid="leggTilBarnKnapp"
        variant="secondary"
        onClick={() => settÅpenModal(true)}
      >
        {hentTekst('barnadine.leggtil', intl)}
      </Button>
    </Box>
  );
};
