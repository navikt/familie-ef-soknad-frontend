import { Alert, VStack } from '@navikt/ds-react';
import React, { type FC } from 'react';
import MultiSvarSpørsmål from '../../../../components/spørsmål/MultiSvarSpørsmål';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import type { ISvar } from '../../../../models/felles/spørsmålogsvar';
import { ESøkerDelerBolig } from '../../../../models/steg/bosituasjon';
import { erValgtSvarLiktSomSvar, harValgtSvar } from '../../../../utils/spørsmålogsvar';
import { hentHTMLTekst, hentTekst } from '../../../../utils/teksthåndtering';
import { useBosituasjon } from './BosituasjonContext';
import { EkteskapslignendeForhold } from './EkteskapslignendeForhold';
import { OmTidligereSamboer } from './OmTidligereSamboer';
import { SøkerSkalFlytteSammenEllerFåSamboer } from './SøkerSkalFlytteSammenEllerFåSamboer';

export const BosituasjonSpørsmål: FC = () => {
    const intl = useLokalIntlContext();

    const { bosituasjon, oppdaterDelerBoligMedAndreVoksne, hovedSpørsmål } = useBosituasjon();
    const { delerBoligMedAndreVoksne, samboerDetaljer, datoFlyttetFraHverandre } = bosituasjon;

    const valgtSvar: ISvar | undefined = hovedSpørsmål.svaralternativer.find(svar =>
        erValgtSvarLiktSomSvar(delerBoligMedAndreVoksne.verdi, svar.svar_tekst)
    );

    const harFyltUtIdentEllerKjennerIkkeIdentPåTidligereSamboer =
        samboerDetaljer?.kjennerIkkeIdent || harValgtSvar(samboerDetaljer?.ident?.verdi);

    const ferdigUtfyltTidligereSamboerFortsattRegistrertPåAdresse =
        delerBoligMedAndreVoksne.svarid === ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse &&
        harValgtSvar(samboerDetaljer?.navn?.verdi) &&
        harFyltUtIdentEllerKjennerIkkeIdentPåTidligereSamboer &&
        harValgtSvar(datoFlyttetFraHverandre?.verdi);

    const visOmTidligereSamboer =
        delerBoligMedAndreVoksne.svarid === ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse;
    const visPlanerOmÅFlytteSammenEllerFåSamboer =
        delerBoligMedAndreVoksne.svarid === ESøkerDelerBolig.borAleneMedBarnEllerGravid ||
        delerBoligMedAndreVoksne.svarid === ESøkerDelerBolig.delerBoligMedAndreVoksne ||
        ferdigUtfyltTidligereSamboerFortsattRegistrertPåAdresse;
    const visTidligereSamboerBorPåSammeAdresseAlert =
        delerBoligMedAndreVoksne.svarid === ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse;
    const visEkteskapLignendeForhold = delerBoligMedAndreVoksne.svarid === ESøkerDelerBolig.harEkteskapsliknendeForhold;

    return (
        <VStack gap={'space-24'}>
            <MultiSvarSpørsmål
                key={hovedSpørsmål.søknadid}
                spørsmål={hovedSpørsmål}
                valgtSvar={delerBoligMedAndreVoksne.verdi}
                settSpørsmålOgSvar={oppdaterDelerBoligMedAndreVoksne}
            />

            {valgtSvar && valgtSvar.alert_tekstid && (
                <VStack>
                    {visTidligereSamboerBorPåSammeAdresseAlert ? (
                        <Alert variant={'info'} size={'small'} inline>
                            {hentHTMLTekst(valgtSvar.alert_tekstid, intl)}
                        </Alert>
                    ) : (
                        <Alert variant={'warning'} size={'small'} inline>
                            {hentTekst(valgtSvar.alert_tekstid, intl)}
                        </Alert>
                    )}
                </VStack>
            )}

            {visOmTidligereSamboer && <OmTidligereSamboer />}

            {visPlanerOmÅFlytteSammenEllerFåSamboer && <SøkerSkalFlytteSammenEllerFåSamboer />}

            {visEkteskapLignendeForhold && <EkteskapslignendeForhold />}
        </VStack>
    );
};
