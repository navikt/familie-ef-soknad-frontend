import React from 'react';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import BarnMedSærligeBehovBegrunnelse from './BarnMedSærligeBehovBegrunnelse';
import HvilkeBarnHarSærligeBehov from './HvilkeBarnHarSærligeBehov';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { BodyShort } from '@navikt/ds-react';
import { hentHTMLTekst, hentTekst } from '../../../../utils/teksthåndtering';
import { AlertStripeDokumentasjon } from '../../../../components/alertstripeDokumentasjon/AlertstripeDokumentasjon';

const BarnMedSærligeBehov: React.FC = () => {
  const intl = useLokalIntlContext();
  return (
    <>
      <KomponentGruppe>
        <AlertStripeDokumentasjon>
          <BodyShort className="blokk-xs" style={{ fontWeight: 600 }}>
            {hentTekst('dinSituasjon.dok.harBarnMedSærligeBehov.tittel', intl)}
          </BodyShort>
          {hentHTMLTekst('dinSituasjon.dok.harBarnMedSærligeBehov.beskrivelse', intl)}
        </AlertStripeDokumentasjon>
      </KomponentGruppe>
      <HvilkeBarnHarSærligeBehov />
      <BarnMedSærligeBehovBegrunnelse />
    </>
  );
};

export default BarnMedSærligeBehov;
