import { BodyShort, Box, Checkbox, Heading, VStack } from '@navikt/ds-react';
import { hentTekst, hentTekstMedEnVariabel } from '../../utils/teksthåndtering';
import React from 'react';
import { useLokalIntlContext } from '../../context/LokalIntlContext';

export const DisclaimerBoks: React.FC<{
  navn: string;
  tekst: string;
  harBekreftet: boolean;
  settBekreftelse: (bekreftet: boolean) => void;
}> = ({ navn, tekst, harBekreftet, settBekreftelse }) => {
  const intl = useLokalIntlContext();
  return (
    <VStack gap={'2'}>
      <Heading level="2" size="small">
        {hentTekst('skjema.forside.disclaimer.tittel', intl)}
      </Heading>
      <Box
        background={harBekreftet ? 'surface-success-subtle' : 'surface-warning-subtle'}
        padding={'4'}
        borderWidth={'1'}
        borderRadius={'medium'}
        borderColor={harBekreftet ? 'border-success' : 'border-warning'}
      >
        <BodyShort>{hentTekst(tekst, intl)}</BodyShort>
        <Checkbox checked={!!harBekreftet} onChange={() => settBekreftelse(!harBekreftet)}>
          {hentTekstMedEnVariabel('side.bekreftelse', intl, navn)}
        </Checkbox>
      </Box>
    </VStack>
  );
};
