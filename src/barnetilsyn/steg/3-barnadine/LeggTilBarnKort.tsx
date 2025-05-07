import { BodyShort, Button } from '@navikt/ds-react';
import { hentTekst } from '../../../utils/søknad';
import { useLokalIntlContext } from '../../../context/LokalIntlContext';
import styled from 'styled-components';
import React from 'react';

const BarnekortContainer = styled.div`
  width: 276px;
  background-color: #e7e9e9;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  align-items: center;
  height: fit-content;
`;

export const LeggTilBarnKort: React.FC<{
  settÅpenModal: (åpen: React.SetStateAction<boolean>) => void;
}> = ({ settÅpenModal }) => {
  const intl = useLokalIntlContext();

  return (
    <BarnekortContainer>
      <BodyShort as="p">{hentTekst('barnadine.leggtil.info', intl)}</BodyShort>
      <Button variant="secondary" onClick={() => settÅpenModal(true)}>
        {hentTekst('barnadine.leggtil', intl)}
      </Button>
    </BarnekortContainer>
  );
};
