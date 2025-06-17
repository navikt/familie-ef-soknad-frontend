import React from 'react';
import VeilederSnakkeboble from '../../assets/VeilederSnakkeboble';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { hentBeskjedMedNavn } from '../../utils/språk';
import { usePersonContext } from '../../context/PersonContext';
import styled from 'styled-components';

const VeilederContainer = styled.div`
  margin-bottom: 4rem;
`;

export interface VeilederBoksProps {
  navn?: string;
}

export const VeilederBoks: React.FC<VeilederBoksProps> = ({ navn }) => {
  const intl = useLokalIntlContext();
  const { person } = usePersonContext();

  const søkerNavn = navn ? navn : person.søker.forkortetNavn;
  return (
    <VeilederContainer>
      <VeilederSnakkeboble
        tekst={hentBeskjedMedNavn(
          søkerNavn,
          intl.formatMessage({ id: 'skjema.hei' })
        )}
      />
    </VeilederContainer>
  );
};
