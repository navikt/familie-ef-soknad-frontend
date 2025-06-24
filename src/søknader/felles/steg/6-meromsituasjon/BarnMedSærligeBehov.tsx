import React from 'react';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import AlertStripeDokumentasjon from '../../../../components/AlertstripeDokumentasjon';
import BarnMedSærligeBehovBegrunnelse from './BarnMedSærligeBehovBegrunnelse';
import HvilkeBarnHarSærligeBehov from './HvilkeBarnHarSærligeBehov';
import LocaleTekst from '../../../../language/LocaleTekst';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { BodyShort } from '@navikt/ds-react';

const BarnMedSærligeBehov: React.FC = () => {
  const intl = useLokalIntlContext();
  return (
    <>
      <KomponentGruppe>
        <AlertStripeDokumentasjon>
          <BodyShort className="blokk-xs" style={{ fontWeight: 600 }}>
            {intl.formatMessage({
              id: 'dinSituasjon.dok.harBarnMedSærligeBehov.tittel',
            })}
          </BodyShort>
          <LocaleTekst tekst="dinSituasjon.dok.harBarnMedSærligeBehov.beskrivelse" />
        </AlertStripeDokumentasjon>
      </KomponentGruppe>
      <HvilkeBarnHarSærligeBehov />
      <BarnMedSærligeBehovBegrunnelse />
    </>
  );
};

export default BarnMedSærligeBehov;
