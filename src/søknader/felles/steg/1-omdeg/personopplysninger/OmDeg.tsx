import React from 'react';
import { BodyShort, Heading, VStack } from '@navikt/ds-react';
import { hentTekst } from '../../../../../utils/søknad';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { Adresse } from '../../../../../models/søknad/person';
import { utledFormatertSivilstand } from '../../../../../utils/sivilstatus';

interface Props {
  personIdent: string;
  statsborgerskap: string;
  sivilstand: string;
  adresse: Adresse;
}

export const OmDeg: React.FC<Props> = ({
  personIdent,
  statsborgerskap,
  sivilstand,
  adresse,
}) => {
  const intl = useLokalIntlContext();

  const formatertSivilstand = utledFormatertSivilstand(sivilstand, intl);

  return (
    <VStack gap={'4'}>
      <VStack align={'start'}>
        <Heading size="xsmall">
          {hentTekst('person.ident.visning', intl)}
        </Heading>
        <BodyShort size="medium" weight="regular">
          {personIdent}
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
        <Heading size="xsmall">{hentTekst('sivilstatus.tittel', intl)}</Heading>
        <BodyShort size="medium" weight="regular">
          {formatertSivilstand}
        </BodyShort>
      </VStack>
      <VStack align={'start'}>
        <Heading size="xsmall">{hentTekst('person.adresse', intl)}</Heading>
        <BodyShort size="medium" weight="regular">
          {adresse.adresse}
        </BodyShort>
        <BodyShort size="medium" weight="regular">
          {adresse.poststed
            ? `${adresse.postnummer} - ${adresse.poststed}`
            : adresse.postnummer}
        </BodyShort>
      </VStack>
    </VStack>
  );
};
