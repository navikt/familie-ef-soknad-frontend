import React from 'react';
import { Heading, VStack } from '@navikt/ds-react';
import styles from './SøknadBanner.module.css';
import { useLokalIntlContext } from '../context/LokalIntlContext';
import { hentTekst } from '../utils/teksthåndtering';

interface Props {
  bannerKey: string;
}

export const SøknadBanner: React.FC<Props> = ({ bannerKey }) => {
  const intl = useLokalIntlContext();
  const bannerTekst = hentTekst(bannerKey, intl);

  return (
    <VStack className={styles.banner} align="center">
      <Heading size="large" className={styles.heading}>
        {bannerTekst}
      </Heading>
    </VStack>
  );
};
