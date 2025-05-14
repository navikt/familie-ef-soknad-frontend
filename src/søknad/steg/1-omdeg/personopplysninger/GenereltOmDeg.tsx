import React from 'react';
import { Alert, BodyShort, Heading, VStack } from '@navikt/ds-react';
import { hentTekst } from '../../../../utils/søknad';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { hentSivilstatus } from '../../../../helpers/steg/omdeg';
import { LokalIntlShape } from '../../../../language/typer';

interface OmDegFelles {
  personIdent: string;
  statsborgerskap: string;
  sivilstand: string;
  adresse: string;
  postnummer: string;
  poststed?: string;
}

const utledFormatertSivilstand = (
  sivilstand: string,
  intl: LokalIntlShape
): string => {
  const sivilstatusKode = hentSivilstatus(sivilstand);
  return hentTekst(sivilstatusKode, intl);
};

export const GenereltOmDeg: React.FC<OmDegFelles> = ({
  personIdent,
  statsborgerskap,
  sivilstand,
  adresse,
  poststed,
  postnummer,
}) => {
  const intl = useLokalIntlContext();

  const formatertSivilstand = utledFormatertSivilstand(sivilstand, intl);

  return (
    <VStack gap={'4'}>
      <Alert variant="info">
        {hentTekst('personopplysninger.alert.infohentet', intl)}
      </Alert>

      <VStack align={'start'}>
        <Heading size="xsmall">
          {hentTekst('person.ident.visning', intl)}
        </Heading>
        <BodyShort size="medium" weight="regular">
          {personIdent}
        </BodyShort>
      </VStack>

      <VStack align={'start'}>
        <Heading size="xsmall">{hentTekst('sivilstatus.tittel', intl)}</Heading>
        <BodyShort size="medium" weight="regular">
          {formatertSivilstand}
        </BodyShort>
      </VStack>

      <VStack align={'start'}>
        <Heading size="xsmall">
          {hentTekst('person.statsborgerskap', intl)}
        </Heading>
        <BodyShort size="medium" weight="regular">
          {statsborgerskap}
        </BodyShort>
      </VStack>

      <VStack align={'start'}>
        <Heading size="xsmall">{hentTekst('person.adresse', intl)}</Heading>
        <BodyShort size="medium" weight="regular">
          {adresse}
        </BodyShort>
        <BodyShort size="medium" weight="regular">
          {`${postnummer} - ${poststed}`}
        </BodyShort>
      </VStack>
    </VStack>
  );
};
