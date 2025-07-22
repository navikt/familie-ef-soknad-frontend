import React from 'react';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import AlertStripeDokumentasjon from '../../../../components/AlertstripeDokumentasjon';
import BarnMedSærligeBehovBegrunnelse from './BarnMedSærligeBehovBegrunnelse';
import HvilkeBarnHarSærligeBehov from './HvilkeBarnHarSærligeBehov';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { BodyShort } from '@navikt/ds-react';
import { hentTekst } from '../../../../utils/søknad';

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
          {hentTekst('dinSituasjon.dok.harBarnMedSærligeBehov.beskrivelse', intl)}
        </AlertStripeDokumentasjon>
      </KomponentGruppe>
      <HvilkeBarnHarSærligeBehov />
      <BarnMedSærligeBehovBegrunnelse />
    </>
  );
};

export default BarnMedSærligeBehov;
