import { FC } from 'react';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { BodyShort, Heading, VStack } from '@navikt/ds-react';
import { hentHTMLTekst, hentTekst } from '../../../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';

interface Props {
  stønadstype: Stønadstype;
}

export const EttersendDokumentasjon: FC<Props> = ({ stønadstype }) => {
  const intl = useLokalIntlContext();
  return (
    <VStack gap={'space-16'}>
      <Heading size="small" level="3">
        {hentTekst('dokumentasjon.ettersend.tittel', intl)}
      </Heading>
      <BodyShort>{hentHTMLTekst(`dokumentasjon.ettersend.tekst.${stønadstype}`, intl)}</BodyShort>
    </VStack>
  );
};
