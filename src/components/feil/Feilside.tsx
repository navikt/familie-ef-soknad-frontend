import { FC } from 'react';
import { EAlvorlighetsgrad } from '../../models/felles/feilmelding';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { Alert } from '@navikt/ds-react';
import { hentHTMLTekst } from '../../utils/teksthåndtering';

type AlertVariant = 'info' | 'success' | 'error' | 'warning';

const Feilside: FC<{ tekstId?: string; alvorlighetsgrad?: string }> = ({
  tekstId,
  alvorlighetsgrad,
}) => {
  let variant: AlertVariant = 'error';

  switch (alvorlighetsgrad) {
    case EAlvorlighetsgrad.INFO:
      variant = 'info';
      break;
    case EAlvorlighetsgrad.WARNING:
      variant = 'warning';
      break;
    default:
  }

  const intl = useLokalIntlContext();
  return (
    <div className="feilside">
      <Alert variant={variant}>
        {tekstId ? hentHTMLTekst(tekstId, intl) : intl.formatMessage({ id: 'feil.alert' })}
      </Alert>
    </div>
  );
};

export default Feilside;
