import React from 'react';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import AlertStripeDokumentasjon from '../../../../components/AlertstripeDokumentasjon';
import LocaleTekst from '../../../../language/LocaleTekst';
import { BodyShort } from '@navikt/ds-react';

const SøkerErSyk: React.FC = () => {
  return (
    <KomponentGruppe>
      <AlertStripeDokumentasjon>
        <BodyShort>
          <LocaleTekst tekst={'dinSituasjon.alert.erSyk'} />
        </BodyShort>
      </AlertStripeDokumentasjon>
    </KomponentGruppe>
  );
};
export default SøkerErSyk;
