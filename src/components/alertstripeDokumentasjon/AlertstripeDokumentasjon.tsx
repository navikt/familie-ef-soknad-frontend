import React, { FC } from 'react';
import { BodyShort } from '@navikt/ds-react';
import { FilIkon } from '../../assets/FilIkon';
import styles from './AlertStripeDokumentasjon.module.css';

export const AlertStripeDokumentasjon: FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className={styles.alertstripe}>
      <FilIkon className={styles.ikon} />
      <div className={styles.tekst}>
        <BodyShort>{children}</BodyShort>
      </div>
    </div>
  );
};
