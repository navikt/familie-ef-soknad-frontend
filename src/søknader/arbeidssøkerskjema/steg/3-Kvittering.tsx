import React from 'react';
import Side from '../side/Side';
import { dagensDato, formatDateHour } from '../../../utils/dato';
import { hentHTMLTekst, hentTekst } from '../../../utils/teksthåndtering';
import { useSkjema } from '../SkjemaContext';
import Feilside from '../../../components/feil/Feilside';
import { useLokalIntlContext } from '../../../context/LokalIntlContext';
import { Alert, BodyShort, Link, VStack } from '@navikt/ds-react';

export const Kvittering: React.FC = () => {
  const intl = useLokalIntlContext();
  const { skjema } = useSkjema();

  const mottattAlert: string =
    hentTekst('skjema.alert.mottatt', intl) +
    ` ${formatDateHour(skjema?.innsendingsdato ? skjema.innsendingsdato : dagensDato)} `;

  return skjema?.innsendingsdato ? (
    <Side
      tittel={hentTekst('skjema.takk', intl)}
      skalViseKnapper={false}
      skalViseStegindikator={false}
    >
      <VStack gap={'12'}>
        <Alert size="small" variant="success">
          {mottattAlert}
        </Alert>
        <BodyShort>{hentHTMLTekst('skjema.beskrivelse', intl)}</BodyShort>

        <BodyShort>{hentHTMLTekst('arbeidssøker.tekst.tillegstønad', intl)}</BodyShort>
        <Link href={'https://www.nav.no/tilleggsstonader-enslig'}>
          <BodyShort>{hentTekst('arbeidssøker.lenke.tilleggstønad', intl)}</BodyShort>
        </Link>
        <Link href={'https://arbeidssokerregistrering.nav.no/'}>
          {hentTekst('arbeidssøker.knapp.tilleggstønad', intl)}
        </Link>
      </VStack>
    </Side>
  ) : (
    <Feilside />
  );
};
