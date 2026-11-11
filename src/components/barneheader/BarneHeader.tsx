import { Heading } from '@navikt/ds-react';
import type React from 'react';
import barn1 from '../../assets/barn1.svg';
import ufødtIkon from '../../assets/ufodt.svg';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import type { IBarn } from '../../models/steg/barn';
import { hentBarnetsNavnEllerBeskrivelse } from '../../utils/barn';
import { førsteBokstavStor } from '../../utils/språk';
import styles from './BarneHeader.module.css';

interface Props {
    barn: IBarn;
    visBakgrunn?: boolean;
}

export const BarneHeader: React.FC<Props> = ({ barn, visBakgrunn = false }) => {
    const ikon = barn.født?.verdi ? barn1 : ufødtIkon;
    const intl = useLokalIntlContext();

    return (
        <div>
            <div className={visBakgrunn ? styles.barnasBostedHeader : styles.barnasBostedTom}>
                <img alt="barn" className="barneikon" src={ikon} />
            </div>
            <div className={styles.navn}>
                <Heading level="3" size="small">
                    {førsteBokstavStor(hentBarnetsNavnEllerBeskrivelse(barn, intl))}
                </Heading>
            </div>
        </div>
    );
};
