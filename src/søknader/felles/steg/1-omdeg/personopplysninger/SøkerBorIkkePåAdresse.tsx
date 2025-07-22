import { FC } from 'react';
import KomponentGruppe from '../../../../../components/gruppe/KomponentGruppe';
import FeltGruppe from '../../../../../components/gruppe/FeltGruppe';
import { Stønadstype } from '../../../../../models/søknad/stønadstyper';
import { Alert, BodyShort, Label } from '@navikt/ds-react';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import {
  hentHTMLTekst,
  hentHTMLTekstMedEnVariabel,
  hentTekst,
} from '../../../../../utils/teksthåndtering';

interface Props {
  stønadstype: Stønadstype;
}

const lenkerPDFSøknad = {
  [Stønadstype.overgangsstønad]:
    'https://www.nav.no/soknader/nb/person/familie/enslig-mor-eller-far/NAV%2015-00.01/dokumentinnsending',
  [Stønadstype.barnetilsyn]:
    'https://www.nav.no/soknader/nb/person/familie/enslig-mor-eller-far/NAV%2015-00.02/dokumentinnsending',
  [Stønadstype.skolepenger]:
    'https://www.nav.no/soknader/nb/person/familie/enslig-mor-eller-far/NAV%2015-00.04/dokumentinnsending',
};

const SøkerBorIkkePåAdresse: FC<Props> = ({ stønadstype }) => {
  const intl = useLokalIntlContext();
  return (
    <>
      <KomponentGruppe>
        <Alert size="small" variant="warning" inline>
          {hentHTMLTekst('personopplysninger.alert.riktigAdresse', intl)}
        </Alert>
      </KomponentGruppe>
      <KomponentGruppe>
        <FeltGruppe>
          <Label as="p">{hentTekst('personopplysninger.info.endreAdresse', intl)}</Label>
        </FeltGruppe>
        <FeltGruppe>
          <BodyShort>
            {hentHTMLTekstMedEnVariabel(
              `personopplysninger.lenke.pdfskjema.${stønadstype}`,
              intl,
              lenkerPDFSøknad[stønadstype]
            )}
          </BodyShort>
        </FeltGruppe>
      </KomponentGruppe>
    </>
  );
};

export default SøkerBorIkkePåAdresse;
