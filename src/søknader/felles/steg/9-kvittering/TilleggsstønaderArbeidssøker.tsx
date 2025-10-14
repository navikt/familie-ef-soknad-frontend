import { FC } from 'react';
import FeltGruppe from '../../../../components/gruppe/FeltGruppe';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
import { BodyShort, Heading, Link } from '@navikt/ds-react';
import { hentHTMLTekst, hentTekst } from '../../../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';

export const TilleggsstønaderArbeidssøker: FC = () => {
  const intl = useLokalIntlContext();
  return (
    <SeksjonGruppe>
      <FeltGruppe>
        <Heading size="small" level="4">
          {hentTekst('kvittering.tittel.tilleggsstønader.arbeidssøker', intl)}
        </Heading>
      </FeltGruppe>
      <FeltGruppe>
        <BodyShort>
          {hentHTMLTekst('kvittering.beskrivelse.tilleggsstønader.arbeidssøker', intl)}
        </BodyShort>
      </FeltGruppe>
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
    </SeksjonGruppe>
  );
};
