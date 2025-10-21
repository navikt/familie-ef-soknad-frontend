import { FC } from 'react';
import { BodyShort, VStack } from '@navikt/ds-react';
import { hentHTMLTekst, hentTekst } from '../../../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';

export const DineSaker: FC = () => {
  const intl = useLokalIntlContext();
  return (
    <VStack gap={'4'}>
      <BodyShort>{hentTekst('kvittering.tekst.altViTrenger', intl)}</BodyShort>
      <BodyShort>{hentHTMLTekst('kvittering.tekst.dineSaker', intl)}</BodyShort>
    </VStack>
  );
};
