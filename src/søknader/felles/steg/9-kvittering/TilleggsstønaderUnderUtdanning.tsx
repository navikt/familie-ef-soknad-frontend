import { FC } from 'react';
import FeltGruppe from '../../../../components/gruppe/FeltGruppe';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
import { hentHTMLTekst, hentTekst } from '../../../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { BodyShort, Heading, Link } from '@navikt/ds-react';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';

export const TilleggsstønaderUnderUtdanning: FC<{ stønadstype: Stønadstype }> = ({
  stønadstype,
}) => {
  const intl = useLokalIntlContext();
  return (
    <SeksjonGruppe>
      {stønadstype === Stønadstype.overgangsstønad && (
        <KomponentGruppe>
          <FeltGruppe>
            <Heading size="small" level="4">
              {hentTekst('kvittering.tittel.skolepenger', intl)}
            </Heading>
          </FeltGruppe>
          <FeltGruppe>
            <BodyShort>{hentTekst('kvittering.tekst.skolepenger', intl)}</BodyShort>
          </FeltGruppe>
          <div>
            <Link href={'https://www.nav.no/skolepenger-enslig'}>
              <BodyShort>{hentTekst('kvittering.lenke.skolepenger', intl)}</BodyShort>
            </Link>
          </div>
          <KomponentGruppe>
            <Link
              href={'https://www.nav.no/soknader/nb/person/familie/enslig-mor-eller-far#NAV150004'}
            >
              {hentTekst('kvittering.knapp.skolepenger', intl)}
            </Link>
          </KomponentGruppe>
        </KomponentGruppe>
      )}
      <FeltGruppe>
        <Heading size="small" level="4">
          {hentTekst('kvittering.tittel.tilleggsstønader', intl)}
        </Heading>
      </FeltGruppe>

      <FeltGruppe>
        <BodyShort>{hentHTMLTekst('kvittering.beskrivelse.tilleggsstønader', intl)}</BodyShort>
      </FeltGruppe>

      <BodyShort>
        <Link href={'https://www.nav.no/tilleggsstonader-enslig'}>
          {hentTekst('kvittering.lenke.tilleggsstønader', intl)}
        </Link>
      </BodyShort>
      <BodyShort>
        <Link href={'https://www.nav.no/soknader/nb/person/arbeid/tilleggsstonader'}>
          {hentTekst('kvittering.knapp.tilleggsstønader', intl)}
        </Link>
      </BodyShort>
    </SeksjonGruppe>
  );
};
