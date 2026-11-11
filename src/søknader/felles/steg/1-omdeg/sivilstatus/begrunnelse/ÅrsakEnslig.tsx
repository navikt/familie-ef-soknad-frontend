import { Alert, VStack } from '@navikt/ds-react';
import React, { type FC } from 'react';
import MultiSvarSpørsmål from '../../../../../../components/spørsmål/MultiSvarSpørsmål';
import { useLokalIntlContext } from '../../../../../../context/LokalIntlContext';
import type { ISpørsmål, ISvar } from '../../../../../../models/felles/spørsmålogsvar';
import { EBegrunnelse } from '../../../../../../models/steg/omDeg/sivilstatus';
import { hentSvarAlertFraSpørsmål } from '../../../../../../utils/søknad';
import { hentHTMLTekst, hentTekst } from '../../../../../../utils/teksthåndtering';
import { useOmDeg } from '../../OmDegContext';
import { begrunnelseSpørsmål } from '../SivilstatusConfig';
import { DatoForSamlivsbrudd } from './DatoForSamlivsbrudd';
import { EndringISamvær } from './EndringISamvær';
import { OmDenTidligereSamboerenDin } from './OmDenTidligereSamboerenDin';

export const ÅrsakEnslig: FC = () => {
    const intl = useLokalIntlContext();
    const spørsmål: ISpørsmål = begrunnelseSpørsmål(intl);
    const { sivilstatus, settSivilstatus, settDokumentasjonsbehov } = useOmDeg();

    const { årsakEnslig } = sivilstatus;

    const settÅrsakEnslig = (spørsmål: ISpørsmål, svar: ISvar) => {
        settSivilstatus({
            ...sivilstatus,
            årsakEnslig: {
                spørsmålid: spørsmål.søknadid,
                svarid: svar.id,
                label: hentTekst(spørsmål.tekstid, intl),
                verdi: svar.svar_tekst,
            },
        });

        settDokumentasjonsbehov(spørsmål, svar);
    };

    const alertTekstForDødsfall = hentSvarAlertFraSpørsmål(EBegrunnelse.dødsfall, spørsmål);

    const visDatoForSamlivsbrudd = årsakEnslig?.svarid === EBegrunnelse.samlivsbruddForeldre;
    const visOmDenTidligereSamboerenDin = årsakEnslig?.svarid === EBegrunnelse.samlivsbruddAndre;
    const visEndringISamvær = årsakEnslig?.svarid === EBegrunnelse.endringISamværsordning;
    const visDødsfallAlert = årsakEnslig?.svarid === EBegrunnelse.dødsfall;

    return (
        <VStack gap={'space-24'}>
            <MultiSvarSpørsmål
                key={spørsmål.tekstid}
                spørsmål={spørsmål}
                valgtSvar={sivilstatus.årsakEnslig?.verdi}
                settSpørsmålOgSvar={settÅrsakEnslig}
            />

            {visDatoForSamlivsbrudd && <DatoForSamlivsbrudd />}

            {visOmDenTidligereSamboerenDin && <OmDenTidligereSamboerenDin />}

            {visEndringISamvær && <EndringISamvær />}

            {visDødsfallAlert && (
                <Alert variant="info" size="small" inline>
                    {hentHTMLTekst(alertTekstForDødsfall, intl)}
                </Alert>
            )}
        </VStack>
    );
};
