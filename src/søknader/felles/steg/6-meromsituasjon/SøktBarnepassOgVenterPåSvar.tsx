import React from 'react';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { hentHTMLTekst } from '../../../../utils/teksthåndtering';
import { AlertStripeDokumentasjon } from '../../../../components/alertstripeDokumentasjon/AlertstripeDokumentasjon';

const SøktBarnepassOgVenterPåSvar: React.FC = () => {
  const intl = useLokalIntlContext();
  return (
    <KomponentGruppe>
      <AlertStripeDokumentasjon>
        {hentHTMLTekst('dinSituasjon.alert.harSøktBarnepassOgVenterEnnå', intl)}
      </AlertStripeDokumentasjon>
    </KomponentGruppe>
  );
};
export default SøktBarnepassOgVenterPåSvar;
