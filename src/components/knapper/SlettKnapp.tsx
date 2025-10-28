import React from 'react';
import { TrashIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { hentTekst } from '../../utils/teksthåndtering';

interface Props {
  className?: string;
  tekstid: string;
  onClick: () => void;
}

export const SlettKnapp: React.FC<Props> = ({ tekstid, onClick, className }) => {
  const intl = useLokalIntlContext();
  return (
    <Button
      className={className}
      iconPosition={'right'}
      icon={<TrashIcon />}
      onClick={() => onClick()}
      type="button"
      variant={'tertiary'}
    >
      <span>{hentTekst(tekstid, intl)}</span>
    </Button>
  );
};
