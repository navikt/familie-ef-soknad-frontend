import { Label, RadioGroup, VStack } from '@navikt/ds-react';
import type React from 'react';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import type { ISpørsmål, ISvar } from '../../models/felles/spørsmålogsvar';
import type { IDatoFelt, ISpørsmålBooleanFelt } from '../../models/søknad/søknadsfelter';
import { strengTilDato } from '../../utils/dato';
import { hentTekst } from '../../utils/teksthåndtering';
import { AlertStripeDokumentasjon } from '../AlertstripeDokumentasjon';
import { GyldigeDatoer } from '../dato/GyldigeDatoer';
import MånedÅrVelger from '../dato/MånedÅrVelger';
import { LesMerTekst } from '../lesmertekst/LesMerTekst';
import { RadioKnapp } from '../panel/RadioKnapp';
import styles from '../spørsmål/Spørsmål.module.css';

interface Props {
    spørsmål: ISpørsmål;
    settSøkerFraBestemtMåned: (spørsmål: ISpørsmål, svar: ISvar) => void;
    søkerFraBestemtMåned: ISpørsmålBooleanFelt | undefined;
    settDato: (dato: Date | null) => void;
    valgtDato: IDatoFelt | undefined;
    datovelgerLabel: string;
    hjelpetekstInnholdTekst: string | React.ReactNode;
    alertTekst?: string;
}

const NårSøkerDuStønadFra: React.FC<Props> = ({
    spørsmål,
    settSøkerFraBestemtMåned,
    settDato,
    søkerFraBestemtMåned,
    valgtDato,
    datovelgerLabel,
    hjelpetekstInnholdTekst,
    alertTekst,
}) => {
    const intl = useLokalIntlContext();

    return (
        <VStack gap={'space-64'}>
            <VStack>
                <div className={`${styles.radioGruppe} ${styles.multiSvar}`}>
                    <RadioGroup
                        legend={hentTekst(spørsmål.tekstid, intl)}
                        value={søkerFraBestemtMåned?.svarid}
                        description={
                            <LesMerTekst
                                åpneTekstid={'søkerFraBestemtMåned.hjelpetekst-åpne'}
                                innholdTekst={hjelpetekstInnholdTekst}
                            />
                        }
                    >
                        {spørsmål.svaralternativer.map((svar: ISvar) => {
                            const svarISøknad = svar.id === søkerFraBestemtMåned?.svarid;
                            return (
                                <RadioKnapp
                                    key={svar.svar_tekst}
                                    name={spørsmål.søknadid}
                                    value={svar.id}
                                    checked={svarISøknad ? svarISøknad : false}
                                    onChange={() => settSøkerFraBestemtMåned(spørsmål, svar)}
                                >
                                    {svar.svar_tekst}
                                </RadioKnapp>
                            );
                        })}
                    </RadioGroup>
                </div>
            </VStack>

            {søkerFraBestemtMåned?.verdi === true && (
                <VStack gap={'space-8'}>
                    <Label as="p">{hentTekst('søkerFraBestemtMåned.datovelger', intl)}</Label>
                    <MånedÅrVelger
                        valgtDato={valgtDato?.verdi ? strengTilDato(valgtDato?.verdi) : undefined}
                        tekstid={datovelgerLabel}
                        gyldigeDatoer={GyldigeDatoer.FemÅrTidligereOgSeksMånederFrem}
                        settDato={settDato}
                    />
                    {alertTekst && <AlertStripeDokumentasjon>{hentTekst(alertTekst, intl)}</AlertStripeDokumentasjon>}
                </VStack>
            )}
        </VStack>
    );
};
export default NårSøkerDuStønadFra;
