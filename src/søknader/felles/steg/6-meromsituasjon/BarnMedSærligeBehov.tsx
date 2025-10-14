import React from 'react';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import BarnMedSærligeBehovBegrunnelse from './BarnMedSærligeBehovBegrunnelse';
import HvilkeBarnHarSærligeBehov from './HvilkeBarnHarSærligeBehov';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { Label } from '@navikt/ds-react';
import { hentHTMLTekst, hentTekst } from '../../../../utils/teksthåndtering';
import { AlertStripeDokumentasjon } from '../../../../components/AlertstripeDokumentasjon';

const BarnMedSærligeBehov: React.FC = () => {
  const intl = useLokalIntlContext();
  return (
    <>
      <KomponentGruppe>
        <AlertStripeDokumentasjon>
          <Label size={'small'}>
            {hentTekst('dinSituasjon.dok.harBarnMedSærligeBehov.tittel', intl)}
          </Label>
          <br />
          {hentHTMLTekst('dinSituasjon.dok.harBarnMedSærligeBehov.beskrivelse', intl)}
        </AlertStripeDokumentasjon>
      </KomponentGruppe>
      <HvilkeBarnHarSærligeBehov />
      <BarnMedSærligeBehovBegrunnelse />
    </>
  );
};

export default BarnMedSærligeBehov;
