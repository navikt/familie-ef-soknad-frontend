import React from 'react';
import { VStack } from '@navikt/ds-react';
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
  const steg = GenerelleSøknadSteg;

  return (
    <VStack gap={'6'}>
      <SøknadBanner bannerTekst={bannerTekst} />
      <VStack gap={'6'} className={styles.innhold}>
        <StegindikatorV2 steg={steg} aktivtSteg={søknadSteg} />

        {children}
      </VStack>
    </VStack>
  );
};
