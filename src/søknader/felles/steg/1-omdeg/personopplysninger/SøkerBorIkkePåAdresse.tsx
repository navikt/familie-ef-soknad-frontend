import { FC } from 'react';
import { Stønadstype } from '../../../../../models/søknad/stønadstyper';
import { Alert, BodyShort, Heading, VStack } from '@navikt/ds-react';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import {
  hentHTMLTekst,
  hentHTMLTekstMedEnVariabel,
  hentTekst,
} from '../../../../../utils/teksthåndtering';

interface Props {
  stønadstype: Stønadstype;
}

const lenkerPDFSøknad = {
  [Stønadstype.overgangsstønad]:
    'https://www.nav.no/soknader/nb/person/familie/enslig-mor-eller-far/NAV%2015-00.01/dokumentinnsending',
  [Stønadstype.barnetilsyn]:
    'https://www.nav.no/soknader/nb/person/familie/enslig-mor-eller-far/NAV%2015-00.02/dokumentinnsending',
  [Stønadstype.skolepenger]:
    'https://www.nav.no/soknader/nb/person/familie/enslig-mor-eller-far/NAV%2015-00.04/dokumentinnsending',
};

export const SøkerBorIkkePåAdresse: FC<Props> = ({ stønadstype }) => {
  const intl = useLokalIntlContext();

  return (
    <VStack gap={'8'}>
      <Alert size="small" variant="warning" inline>
        {hentHTMLTekst('personopplysninger.alert.riktigAdresse', intl)}
      </Alert>

      <Heading size={'xsmall'}>{hentTekst('personopplysninger.info.endreAdresse', intl)}</Heading>
      <BodyShort>
        {hentHTMLTekstMedEnVariabel(
          `personopplysninger.lenke.pdfskjema`,
          intl,
          lenkerPDFSøknad[stønadstype]
        )}
      </BodyShort>
    </VStack>
  );
};
