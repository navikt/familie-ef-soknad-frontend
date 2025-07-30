import React from 'react';
import { Alert, BodyShort, Heading, VStack } from '@navikt/ds-react';
import { useLokalIntlContext } from '../../../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../../../utils/teksthåndtering';
import { Adresse } from '../../../../../../models/søknad/person';

interface Props {
  personIdent: string;
  statsborgerskap: string;
  sivilstatus: string;
  adresse?: Adresse;
}

export const PersonopplysningerV2: React.FC<Props> = ({
  personIdent,
  statsborgerskap,
  sivilstatus,
  adresse,
}) => {
  const intl = useLokalIntlContext();

  const personopplysningerAlertTekst = hentTekst('personopplysninger.alert.infohentet', intl);

  const visAdresseFelt = adresse !== undefined && adresse?.adresse.length !== 0;

  return (
    <VStack gap={'4'}>
      <Alert variant="info" size={'small'} inline>
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
            {adresse?.adresse}
          </BodyShort>
          <BodyShort size="medium" weight="regular">
            {adresse.poststed ? `${adresse.postnummer} - ${adresse.poststed}` : adresse.postnummer}
          </BodyShort>
        </VStack>
      )}
    </VStack>
  );
};
