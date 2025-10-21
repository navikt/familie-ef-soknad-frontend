import { FC } from 'react';
import { BodyShort, Heading, Link, VStack } from '@navikt/ds-react';
import { hentHTMLTekst, hentTekst } from '../../../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';

export const TilleggsstønaderArbeidssøker: FC = () => {
  const intl = useLokalIntlContext();
  return (
    <VStack gap={'4'}>
      <Heading size="small" level="4">
        {hentTekst('kvittering.tittel.tilleggsstønader.arbeidssøker', intl)}
      </Heading>
      <BodyShort>
        {hentHTMLTekst('kvittering.beskrivelse.tilleggsstønader.arbeidssøker', intl)}
      </BodyShort>
      <BodyShort>
        <Link href={'https://www.nav.no/tilleggsstonader-enslig'}>
          {hentTekst('kvittering.lenke.tilleggsstønader.arbeidssøker', intl)}
        </Link>
      </BodyShort>
      <BodyShort>
        <Link href={'https://www.nav.no/soknader/nb/person/arbeid/tilleggsstonader'}>
          {hentTekst('kvittering.knapp.tilleggsstønader.arbeidssøker', intl)}
        </Link>
      </BodyShort>
    </VStack>
  );
};
