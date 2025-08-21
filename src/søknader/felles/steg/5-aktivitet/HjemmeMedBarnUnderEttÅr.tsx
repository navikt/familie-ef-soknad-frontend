import React from 'react';
import KomponentGruppe from '../../../../components/gruppe/KomponentGruppe';
import { Alert } from '@navikt/ds-react';
import { hentHTMLTekst } from '../../../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';

const HjemmeMedBarnUnderEttÅr: React.FC = () => {
  const intl = useLokalIntlContext();
  return (
    <>
      <KomponentGruppe>
        <Alert size="small" variant="info" inline>
          {hentHTMLTekst('arbeidssituasjon.alert.aktivitetspliktFraEttÅr', intl)}
        </Alert>
      </KomponentGruppe>
    </>
  );
};

export default HjemmeMedBarnUnderEttÅr;
