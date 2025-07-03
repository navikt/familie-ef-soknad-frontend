import { FC } from 'react';
import LocaleTekst from '../../../../../language/LocaleTekst';
import { Stønadstype } from '../../../../../models/søknad/stønadstyper';
import { BodyShort } from '@navikt/ds-react';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { SpørsmålWrapper } from '../../../../../components/spørsmål/SpørsmålWrapper';
import { hentTekst } from '../../../../../utils/søknad';

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

export const SøkerBorIkkePåAdresse: FC<Props> = ({ stønadstype }) => {
  const intl = useLokalIntlContext();

  return (
    <SpørsmålWrapper tittel={hentTekst('personopplysninger.info.endreAdresse', intl)}>
      <BodyShort>
        <LocaleTekst
          tekst={'personopplysninger.lenke.pdfskjema'}
          replaceArgument0={lenkerPDFSøknad[stønadstype]}
        />
      </BodyShort>
    </SpørsmålWrapper>
  );
};
