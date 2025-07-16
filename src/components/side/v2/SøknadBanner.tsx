import React from 'react';
import { Heading, VStack } from '@navikt/ds-react';
import styles from './SøknadBanner.module.css';

interface Props {
  bannerTekst: string;
}

export const SøknadBanner: React.FC<Props> = ({ bannerTekst }) => {
  return (
    <VStack className={styles.banner} align="center">
      <Heading size="large" className={styles.heading}>
        {bannerTekst}
      </Heading>
    </VStack>
  );
};
