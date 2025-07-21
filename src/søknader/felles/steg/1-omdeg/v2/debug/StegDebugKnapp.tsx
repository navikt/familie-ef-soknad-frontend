import React from 'react';
import { Button } from '@navikt/ds-react';
import styles from './StegDebugKnapp.module.css';
import { useOmDegV2 } from '../typer/OmDegContextV2';

export const StegDebugKnapp: React.FC = () => {
  const { hentStegData } = useOmDegV2();

  const onValiderKlikk = () => {
    const stegData = hentStegData();
    console.log('OmDegStegData er:', stegData);
  };

  return (
    <Button variant="primary" size="medium" className={styles.button} onClick={onValiderKlikk}>
      Valider
    </Button>
  );
};
