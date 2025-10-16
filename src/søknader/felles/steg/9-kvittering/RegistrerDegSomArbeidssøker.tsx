import { FC } from 'react';
import { BodyShort, Link, VStack } from '@navikt/ds-react';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';

export const RegistrerDegSomArbeidssøker: FC = () => {
  const intl = useLokalIntlContext();
  return (
    <VStack gap={'4'}>
      <BodyShort>{hentTekst('kvittering.tekst.arbeidssøker', intl)}</BodyShort>
      <Link href={'https://arbeidssokerregistrering.nav.no/'}>
        {hentTekst('kvittering.knapp.arbeidssøker', intl)}
      </Link>
    </VStack>
  );
};
