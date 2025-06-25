import React from 'react';
import styled from 'styled-components';
import LocaleTekst from '../../language/LocaleTekst';
import { TrashIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

const Knapp = styled(Button)`
  width: fit-content;
`;

interface Props {
  className?: string;
  tekstid: string;
  onClick: () => void;
}

export const SlettKnapp: React.FC<Props> = ({ tekstid, onClick, className }) => (
  <Knapp
    className={className}
    iconPosition={'right'}
    icon={<TrashIcon />}
    onClick={() => onClick()}
    type="button"
    variant={'tertiary'}
  >
    <span>
      <LocaleTekst tekst={tekstid} />
    </span>
  </Knapp>
);
