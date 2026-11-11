import { VStack } from '@navikt/ds-react';
import React, { type FC } from 'react';
import { Datovelger } from '../../../../components/dato/Datovelger';
import { GyldigeDatoer } from '../../../../components/dato/GyldigeDatoer';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { EBosituasjon } from '../../../../models/steg/bosituasjon';
import { harFyltUtSamboerDetaljer } from '../../../../utils/person';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { useBosituasjon } from './BosituasjonContext';
import { OmSamboerenDin } from './OmSamboerenDin';

export const OmTidligereSamboer: FC = () => {
    const intl = useLokalIntlContext();

    const { bosituasjon, settBosituasjon } = useBosituasjon();

    const settDatoFlyttetFraHverandre = (dato: string) => {
        dato !== null &&
            settBosituasjon({
                ...bosituasjon,
                [EBosituasjon.datoFlyttetFraHverandre]: {
                    label: hentTekst('bosituasjon.datovelger.nårFlyttetDereFraHverandre', intl),
                    verdi: dato,
                },
            });
    };

    const visDatoFlyttetFraHverandreVelger =
        bosituasjon.samboerDetaljer && harFyltUtSamboerDetaljer(bosituasjon.samboerDetaljer, true);

    return (
        <VStack gap={'space-24'} align="start">
            <OmSamboerenDin
                tittel={'bosituasjon.tittel.omTidligereSamboer'}
                erIdentEllerFødselsdatoObligatorisk={false}
                samboerDetaljerType={EBosituasjon.samboerDetaljer}
                testIderTextFieldMedBredde={'bosituasjon-tidligere-samboer-navn'}
                testIderIdentEllerFødselsdatoGruppe={[
                    'bosituasjon-tidligere-samboer-fødselsnummer',
                    'bosituasjon-tidligere-samboer-checkbox',
                    'bosituasjon-tidligere-samboer-fødselsdato',
                ]}
            />

            {visDatoFlyttetFraHverandreVelger && (
                <Datovelger
                    aria-live="polite"
                    valgtDato={
                        bosituasjon.datoFlyttetFraHverandre ? bosituasjon.datoFlyttetFraHverandre.verdi : undefined
                    }
                    tekstid={'bosituasjon.datovelger.nårFlyttetDereFraHverandre'}
                    gyldigeDatoer={GyldigeDatoer.Alle}
                    settDato={settDatoFlyttetFraHverandre}
                />
            )}
        </VStack>
    );
};
