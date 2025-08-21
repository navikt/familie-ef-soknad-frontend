import React from 'react';
import { Alert } from '@navikt/ds-react';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { hentHTMLTekst } from '../../utils/teksthåndtering';

export const AlertUnderAtten: React.FC = () => {
  const intl = useLokalIntlContext();
  return (
    <div className="ie-feil">
      <Alert size="small" variant="error">
        {hentHTMLTekst('side.alert.ikkeGammelNok', intl)}
      </Alert>
    </div>
  );
};
