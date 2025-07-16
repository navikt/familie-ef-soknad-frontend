import React from 'react';
import { Alert, BodyShort, Heading, VStack } from '@navikt/ds-react';
import { hentTekst } from '../../../../../../utils/søknad';
import { useLokalIntlContext } from '../../../../../../context/LokalIntlContext';

interface Props {
  personIdent: string;
  statsborgerskap: string;
  sivilstatus: string;
  adresse?: string;
}

export const PersonopplysningerV2: React.FC<Props> = ({
  personIdent,
  statsborgerskap,
  sivilstatus,
  adresse,
}) => {
  const intl = useLokalIntlContext();

  const personopplysningerAlertTekst = hentTekst('personopplysninger.alert.infohentet', intl);

  const visAdresseFelt = adresse !== undefined;

  return (
    <VStack gap={'4'}>
      <Alert variant="info" inline={true}>
        {personopplysningerAlertTekst}
      </Alert>

      <VStack align={'start'}>
        <Heading size="xsmall">{hentTekst('person.ident.visning', intl)}</Heading>
        <BodyShort size="medium" weight="regular">
          {personIdent}
        </BodyShort>
      </VStack>

      <VStack align={'start'}>
        <Heading size="xsmall">{hentTekst('person.statsborgerskap', intl)}</Heading>
        <BodyShort size="medium" weight="regular">
          {statsborgerskap}
        </BodyShort>
      </VStack>

      <VStack align={'start'}>
        <Heading size="xsmall">{hentTekst('sivilstatus.tittel', intl)}</Heading>
        <BodyShort size="medium" weight="regular">
          {sivilstatus}
        </BodyShort>
      </VStack>

      {visAdresseFelt && (
        <VStack align={'start'}>
          <Heading size="xsmall">{hentTekst('person.adresse', intl)}</Heading>
          <BodyShort size="medium" weight="regular">
            {adresse}
          </BodyShort>
        </VStack>
      )}
    </VStack>
  );
};
