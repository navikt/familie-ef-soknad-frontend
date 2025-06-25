import React from 'react';
import LocaleTekst from '../../../../language/LocaleTekst';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import { Alert } from '@navikt/ds-react';

const HjemmeMedBarnUnderEttÅr: React.FC = () => {
  return (
    <>
      <KomponentGruppe>
        <Alert size="small" variant="info" inline>
          <LocaleTekst tekst={'arbeidssituasjon.alert.aktivitetspliktFraEttÅr'} />
        </Alert>
      </KomponentGruppe>
    </>
  );
};

export default HjemmeMedBarnUnderEttÅr;
