import React from 'react';
import { Button } from '@navikt/ds-react';
import styles from './StegDebugKnapp.module.css';
import { OmDegStegData } from '../typer/OmDegStegData';

interface Props {
  stegData: OmDegStegData;
}

export const StegDebugKnapp: React.FC<Props> = ({ stegData }) => {
  return (
    <Button
      variant="primary"
      size="medium"
      className={styles.button}
      onClick={() => {
        console.log('OmDegStegData er: ', stegData);
      }}
    >
      Valider
    </Button>
  );
};
