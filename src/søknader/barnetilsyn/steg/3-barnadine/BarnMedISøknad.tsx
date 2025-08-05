import React, { FC } from 'react';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../utils/teksthåndtering';
import styled from 'styled-components';
import { Checkbox } from '@navikt/ds-react';

const StyledCheckbox = styled(Checkbox)`
  margin: 1rem 0;
  text-align: left;
`;

interface Props {
  skalHaBarnepass?: boolean;
  toggleSkalHaBarnepass: (id: string) => void;
  id: string;
  testId?: string;
}

const BarnMedISøknad: FC<Props> = ({ skalHaBarnepass, toggleSkalHaBarnepass, id, testId }) => {
  const intl = useLokalIntlContext();

  return (
    <StyledCheckbox
      data-testid={testId}
      checked={skalHaBarnepass}
      onChange={() => toggleSkalHaBarnepass(id)}
    >
      {hentTekst('barnadine.knapp.søkBarnetilsyn', intl)}
    </StyledCheckbox>
  );
};

export default BarnMedISøknad;
