import React from 'react';
import Side from '../side/Side';
import { dagensDato, formatDateHour } from '../../../utils/dato';
import { hentTekst } from '../../../utils/søknad';
import KomponentGruppe from '../../../components/gruppe/KomponentGruppe';
import LocaleTekst from '../../../language/LocaleTekst';
import { useSkjema } from '../SkjemaContext';
import Feilside from '../../../components/feil/Feilside';
import FeltGruppe from '../../../components/gruppe/FeltGruppe';
import { logSidevisningArbeidssokerskjema } from '../../../utils/amplitude';
import { useMount } from '../../../utils/hooks';
import { useLokalIntlContext } from '../../../context/LokalIntlContext';
import { Alert, BodyShort, Link } from '@navikt/ds-react';
import { StyledBeskrivelse } from '../../../components/StyledBeskrivelse';

const Kvittering: React.FC = () => {
  const intl = useLokalIntlContext();
  const { skjema } = useSkjema();

  useMount(() => logSidevisningArbeidssokerskjema('Kvittering'));

  const mottattAlert: string =
    hentTekst('skjema.alert.mottatt', intl) +
    ` ${formatDateHour(skjema?.innsendingsdato ? skjema.innsendingsdato : dagensDato)} `;

  return skjema?.innsendingsdato ? (
    <Side
      tittel={intl.formatMessage({ id: 'skjema.takk' })}
      skalViseKnapper={false}
      skalViseStegindikator={false}
    >
      <KomponentGruppe>
        <Alert size="small" variant="success">
          {mottattAlert}
        </Alert>
      </KomponentGruppe>
      <KomponentGruppe>
        <StyledBeskrivelse>
          <BodyShort>
            <LocaleTekst tekst={'skjema.beskrivelse'} />
          </BodyShort>
        </StyledBeskrivelse>
      </KomponentGruppe>

      <KomponentGruppe>
        <FeltGruppe>
          <StyledBeskrivelse>
            <BodyShort>
              <LocaleTekst tekst={'arbeidssøker.tekst.tillegstønad'} />
            </BodyShort>
          </StyledBeskrivelse>
        </FeltGruppe>
        <FeltGruppe>
          <Link href={'https://www.nav.no/tilleggsstonader-enslig'}>
            <BodyShort>
              <LocaleTekst tekst={'arbeidssøker.lenke.tilleggstønad'} />
            </BodyShort>
          </Link>
        </FeltGruppe>
        <Link href={'https://arbeidssokerregistrering.nav.no/'}>
          <LocaleTekst tekst={'arbeidssøker.knapp.tilleggstønad'} />
        </Link>
      </KomponentGruppe>
    </Side>
  ) : (
    <Feilside />
  );
};

export default Kvittering;
