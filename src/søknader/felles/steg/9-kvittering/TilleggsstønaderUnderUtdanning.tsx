import { FC } from 'react';
import { hentHTMLTekst, hentTekst } from '../../../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { BodyShort, Heading, Link, VStack } from '@navikt/ds-react';

export const TilleggsstønaderUnderUtdanning: FC<{ stønadstype: Stønadstype }> = ({
  stønadstype,
}) => {
  const intl = useLokalIntlContext();
  return (
    <VStack gap={'4'}>
      {stønadstype === Stønadstype.overgangsstønad && (
        <VStack>
          <Heading size="small" level="4">
            {hentTekst('kvittering.tittel.skolepenger', intl)}
          </Heading>
          <BodyShort>{hentTekst('kvittering.tekst.skolepenger', intl)}</BodyShort>
          <div>
            <Link href={'https://www.nav.no/skolepenger-enslig'}>
              <BodyShort>{hentTekst('kvittering.lenke.skolepenger', intl)}</BodyShort>
            </Link>
          </div>
          <Link
            href={'https://www.nav.no/soknader/nb/person/familie/enslig-mor-eller-far#NAV150004'}
          >
            {hentTekst('kvittering.knapp.skolepenger', intl)}
          </Link>
        </VStack>
      )}
      <Heading size="small" level="4">
        {hentTekst('kvittering.tittel.tilleggsstønader', intl)}
      </Heading>
      <BodyShort>{hentHTMLTekst('kvittering.beskrivelse.tilleggsstønader', intl)}</BodyShort>
      <BodyShort>
        <Link href={'https://www.nav.no/tilleggsstonader-enslig'}>
          {hentTekst('kvittering.lenke.tilleggsstønader', intl)}
        </Link>
      </BodyShort>
      <BodyShort>
        <Link href={'https://www.nav.no/soknader/nb/person/arbeid/tilleggsstonader'}>
          {hentTekst('kvittering.knapp.tilleggsstønader', intl)}
        </Link>
      </BodyShort>
    </VStack>
  );
};
