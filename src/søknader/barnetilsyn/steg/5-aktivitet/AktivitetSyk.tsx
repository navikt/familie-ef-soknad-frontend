import { Alert, Label, VStack } from '@navikt/ds-react';
import type React from 'react';
import { AlertStripeDokumentasjon } from '../../../../components/AlertstripeDokumentasjon';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { hentHTMLTekst } from '../../../../utils/teksthåndtering';

export const AktivitetSyk: React.FC = () => {
    const intl = useLokalIntlContext();

    return (
        <VStack gap={'space-8'}>
            <Alert variant={'info'} inline>
                <Label as="p">{hentHTMLTekst('erDuIArbeid.alertsstripe-info', intl)}</Label>
            </Alert>
            <AlertStripeDokumentasjon>
                {hentHTMLTekst('erDuIArbeid.alertsstripe-dokumentasjon', intl)}
            </AlertStripeDokumentasjon>
        </VStack>
    );
};
