import { RadioGroup } from '@navikt/ds-react';
import React, { type FC } from 'react';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import type { ISpørsmål, ISvar } from '../../models/felles/spørsmålogsvar';
import { hentTekst } from '../../utils/teksthåndtering';
import { LesMerTekst } from '../lesmertekst/LesMerTekst';
import { RadioKnapp } from '../panel/RadioKnapp';
import styles from './Spørsmål.module.css';

interface Props {
    className?: string;
    spørsmål: ISpørsmål;
    settSpørsmålOgSvar: (spørsmål: ISpørsmål, svar: ISvar) => void;
    valgtSvar: string | undefined;
}

const MultiSvarSpørsmål: FC<Props> = ({ className, spørsmål, settSpørsmålOgSvar, valgtSvar }) => {
    const intl = useLokalIntlContext();

    const legend = hentTekst(spørsmål.tekstid, intl);

    const erToKorteSvar = className === 'toKorteSvar';
    const wrapperClass = [styles.radioGruppe, erToKorteSvar ? styles.toKorteSvar : styles.multiSvar].join(' ');

    return (
        <div className={wrapperClass} key={spørsmål.søknadid}>
            <RadioGroup
                legend={legend}
                value={valgtSvar}
                description={
                    spørsmål.lesmer && (
                        <LesMerTekst
                            åpneTekstid={spørsmål.lesmer ? spørsmål.lesmer.headerTekstid : ''}
                            innholdTekstid={spørsmål.lesmer ? spørsmål!.lesmer!.innholdTekstid : ''}
                        />
                    )
                }
            >
                {spørsmål.svaralternativer.map((svar: ISvar) => {
                    const svarISøknad = svar.svar_tekst === valgtSvar;
                    return (
                        <RadioKnapp
                            key={svar.svar_tekst}
                            name={spørsmål.søknadid}
                            value={svar.svar_tekst}
                            checked={svarISøknad ? svarISøknad : false}
                            onChange={() => {
                                settSpørsmålOgSvar(spørsmål, svar);
                            }}
                        >
                            {svar.svar_tekst}
                        </RadioKnapp>
                    );
                })}
            </RadioGroup>
        </div>
    );
};

export default MultiSvarSpørsmål;
