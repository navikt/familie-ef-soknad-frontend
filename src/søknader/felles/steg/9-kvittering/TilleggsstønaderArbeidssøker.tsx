import { FC } from 'react';
import FeltGruppe from '../../../../components/gruppe/FeltGruppe';
import LocaleTekst from '../../../../language/LocaleTekst';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
import { BodyShort, Heading, Link } from '@navikt/ds-react';
import { StyledBeskrivelse } from '../../../../components/StyledBeskrivelse';

const TilleggsstønaderArbeidssøker: FC = () => {
  return (
    <SeksjonGruppe>
      <FeltGruppe>
        <Heading size="small" level="4">
          <LocaleTekst tekst={'kvittering.tittel.tilleggsstønader.arbeidssøker'} />
        </Heading>
      </FeltGruppe>
      <FeltGruppe>
        <StyledBeskrivelse>
          <BodyShort>
            <LocaleTekst tekst={'kvittering.beskrivelse.tilleggsstønader.arbeidssøker'} />
          </BodyShort>
        </StyledBeskrivelse>
      </FeltGruppe>
      <BodyShort>
        <Link href={'https://www.nav.no/tilleggsstonader-enslig'}>
          <LocaleTekst tekst={'kvittering.lenke.tilleggsstønader.arbeidssøker'} />
        </Link>
      </BodyShort>
      <BodyShort>
        <Link href={'https://www.nav.no/soknader/nb/person/arbeid/tilleggsstonader'}>
          <LocaleTekst tekst={'kvittering.knapp.tilleggsstønader.arbeidssøker'} />
        </Link>
      </BodyShort>
    </SeksjonGruppe>
  );
};

export default TilleggsstønaderArbeidssøker;
