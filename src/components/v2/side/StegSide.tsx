import React from 'react';
import { Heading, VStack } from '@navikt/ds-react';
import { SøknadBanner } from './SøknadBanner';
import { StegindikatorV2 } from '../stegindikator/StegindikatorV2';
import { GenerelleSøknadSteg, SøknadSteg } from '../stegindikator/GenerelleSøknadSteg';
import { useLokalIntlContext } from '../../../context/LokalIntlContext';
import { hentTekst } from '../../../utils/søknad';
import styles from './StegSide.module.css';

interface Props {
  søknadSteg: SøknadSteg;
  children?: React.ReactNode;
}

export const StegSide: React.FC<Props> = ({ søknadSteg, children }) => {
  const intl = useLokalIntlContext();

  const bannerTekst = hentTekst(søknadSteg.stegKey, intl);
  const stegForSøknad = GenerelleSøknadSteg;

  const stegTittel = hentTekst(søknadSteg.stegKey, intl);

  return (
    <VStack gap={'6'}>
      <SøknadBanner bannerTekst={bannerTekst} />
      <VStack gap={'6'} className={styles.innhold}>
        <StegindikatorV2 steg={stegForSøknad} aktivtSteg={søknadSteg} />

        <VStack gap={'8'} className={styles.children}>
          <Heading size={'medium'} className={styles.stegTittel}>
            {stegTittel}
          </Heading>
          {children}
        </VStack>
      </VStack>
    </VStack>
  );
};
