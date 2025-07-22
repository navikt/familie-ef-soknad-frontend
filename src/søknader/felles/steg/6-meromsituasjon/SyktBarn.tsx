import React from 'react';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import AlertStripeDokumentasjon from '../../../../components/AlertstripeDokumentasjon';
import { BodyShort } from '@navikt/ds-react';
import { hentTekst } from '../../../../utils/søknad';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';

const SyktBarn: React.FC = () => {
  const intl = useLokalIntlContext();
  return (
    <KomponentGruppe>
      <AlertStripeDokumentasjon>
        <BodyShort>{hentTekst('dinSituasjon.alert.harSyktBarn', intl)}</BodyShort>
      </AlertStripeDokumentasjon>
    </KomponentGruppe>
  );
};
export default SyktBarn;
