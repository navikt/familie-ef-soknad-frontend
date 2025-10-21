import React from 'react';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { hentHTMLTekst } from '../../../../utils/teksthåndtering';
import { Alert, Label, VStack } from '@navikt/ds-react';
import { AlertStripeDokumentasjon } from '../../../../components/AlertstripeDokumentasjon';

export const AktivitetSyk: React.FC = () => {
  const intl = useLokalIntlContext();

  return (
    <VStack gap={'2'}>
      <Alert variant={'info'} inline>
        <Label as="p">{hentHTMLTekst('erDuIArbeid.alertsstripe-info', intl)}</Label>
      </Alert>
      <AlertStripeDokumentasjon>
        {hentHTMLTekst('erDuIArbeid.alertsstripe-dokumentasjon', intl)}
      </AlertStripeDokumentasjon>
    </VStack>
  );
};
