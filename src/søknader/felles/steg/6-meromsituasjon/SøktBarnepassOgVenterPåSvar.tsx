import React from 'react';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import AlertStripeDokumentasjon from '../../../../components/AlertstripeDokumentasjon';
import LocaleTekst from '../../../../language/LocaleTekst';
import { BodyShort } from '@navikt/ds-react';

const SøktBarnepassOgVenterPåSvar: React.FC = () => {
  return (
    <KomponentGruppe>
      <AlertStripeDokumentasjon>
        <BodyShort>
          <LocaleTekst
            tekst={'dinSituasjon.alert.harSøktBarnepassOgVenterEnnå'}
          />
        </BodyShort>
      </AlertStripeDokumentasjon>
    </KomponentGruppe>
  );
};
export default SøktBarnepassOgVenterPåSvar;
