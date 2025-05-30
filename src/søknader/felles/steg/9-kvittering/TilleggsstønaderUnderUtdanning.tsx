import { FC } from 'react';
import FeltGruppe from '../../../../components/gruppe/FeltGruppe';
import LocaleTekst from '../../../../language/LocaleTekst';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
import { hentTekst } from '../../../../utils/søknad';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { BodyShort, Heading, Link } from '@navikt/ds-react';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import { StyledBeskrivelse } from '../../../../components/StyledBeskrivelse';

const RegistrerDegSomArbeidssøker: FC<{ stønadstype: Stønadstype }> = ({
  stønadstype,
}) => {
  const intl = useLokalIntlContext();
  return (
    <SeksjonGruppe>
      {stønadstype === Stønadstype.overgangsstønad && (
        <KomponentGruppe>
          <FeltGruppe>
            <Heading size="small" level="4">
              <LocaleTekst tekst={'kvittering.tittel.skolepenger'} />
            </Heading>
          </FeltGruppe>
          <FeltGruppe>
            <BodyShort>
              {hentTekst('kvittering.tekst.skolepenger', intl)}
            </BodyShort>
          </FeltGruppe>
          <div>
            <Link href={'https://www.nav.no/skolepenger-enslig'}>
              <BodyShort>
                {hentTekst('kvittering.lenke.skolepenger', intl)}
              </BodyShort>
            </Link>
          </div>
          <KomponentGruppe>
            <Link
              href={
                'https://www.nav.no/soknader/nb/person/familie/enslig-mor-eller-far#NAV150004'
              }
            >
              <LocaleTekst tekst={'kvittering.knapp.skolepenger'} />
            </Link>
          </KomponentGruppe>
        </KomponentGruppe>
      )}
      <FeltGruppe>
        <Heading size="small" level="4">
          <LocaleTekst tekst={'kvittering.tittel.tilleggsstønader'} />
        </Heading>
      </FeltGruppe>

      <FeltGruppe>
        <StyledBeskrivelse>
          <BodyShort>
            <LocaleTekst tekst={'kvittering.beskrivelse.tilleggsstønader'} />
          </BodyShort>
        </StyledBeskrivelse>
      </FeltGruppe>

      <BodyShort>
        <Link href={'https://www.nav.no/tilleggsstonader-enslig'}>
          <LocaleTekst tekst={'kvittering.lenke.tilleggsstønader'} />
        </Link>
      </BodyShort>
      <BodyShort>
        <Link
          href={'https://www.nav.no/soknader/nb/person/arbeid/tilleggsstonader'}
        >
          <LocaleTekst tekst={'kvittering.knapp.tilleggsstønader'} />
        </Link>
      </BodyShort>
    </SeksjonGruppe>
  );
};

export default RegistrerDegSomArbeidssøker;
