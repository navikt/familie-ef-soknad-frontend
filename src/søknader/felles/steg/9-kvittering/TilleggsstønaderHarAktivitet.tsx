import { FC } from 'react';
import FeltGruppe from '../../../../components/gruppe/FeltGruppe';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
import { BodyShort, Heading, Link } from '@navikt/ds-react';
import { hentHTMLTekst, hentTekst } from '../../../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';

const TilleggsstønaderHarAktivitet: FC = () => {
  const intl = useLokalIntlContext();
  return (
    <SeksjonGruppe>
      <FeltGruppe>
        <Heading size="small" level="4">
          {hentTekst('kvittering.tittel.tilleggsstønader.aktivitetskrav', intl)}
        </Heading>
      </FeltGruppe>
      <FeltGruppe>
        <BodyShort>
          {hentHTMLTekst('kvittering.beskrivelse.tilleggsstønader.aktivitetskrav', intl)}
        </BodyShort>
      </FeltGruppe>
      <BodyShort>
        <Link href={'https://www.nav.no/barnetilsyn-enslig'}>
          {hentTekst('kvittering.lenke.tilleggsstønader.aktivitetskrav', intl)}
        </Link>
      </BodyShort>
      <BodyShort>
        <Link href={'https://www.nav.no/soknader/nb/person/familie/enslig-mor-eller-far#NAV150002'}>
          {hentTekst('kvittering.knapp.tilleggsstønader.aktivitetskrav', intl)}
        </Link>
      </BodyShort>
    </SeksjonGruppe>
  );
};

export default TilleggsstønaderHarAktivitet;
