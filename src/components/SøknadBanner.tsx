import { Heading, VStack } from '@navikt/ds-react';
import type React from 'react';
import { useLokalIntlContext } from '../context/LokalIntlContext';
import { hentTekst } from '../utils/teksthåndtering';
import styles from './SøknadBanner.module.css';

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
