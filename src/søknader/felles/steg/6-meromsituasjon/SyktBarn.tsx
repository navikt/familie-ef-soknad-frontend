import React from 'react';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import { hentHTMLTekst } from '../../../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { AlertStripeDokumentasjon } from '../../../../components/alertstripeDokumentasjon/AlertstripeDokumentasjon';

const SyktBarn: React.FC = () => {
  const intl = useLokalIntlContext();
  return (
    <KomponentGruppe>
      <AlertStripeDokumentasjon>
        {hentHTMLTekst('dinSituasjon.alert.harSyktBarn', intl)}
      </AlertStripeDokumentasjon>
    </KomponentGruppe>
  );
};
export default SyktBarn;
