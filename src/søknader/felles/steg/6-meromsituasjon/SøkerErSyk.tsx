import React from 'react';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import AlertStripeDokumentasjon from '../../../../components/AlertstripeDokumentasjon';
import { BodyShort } from '@navikt/ds-react';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { hentHTMLTekst } from '../../../../utils/teksthåndtering';

const SøkerErSyk: React.FC = () => {
  const intl = useLokalIntlContext();
  return (
    <KomponentGruppe>
      <AlertStripeDokumentasjon>
        <BodyShort>{hentHTMLTekst('dinSituasjon.alert.erSyk', intl)}</BodyShort>
      </AlertStripeDokumentasjon>
    </KomponentGruppe>
  );
};
export default SøkerErSyk;
