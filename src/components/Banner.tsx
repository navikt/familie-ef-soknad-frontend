import React from 'react';
import styled from 'styled-components';
import { Heading } from '@navikt/ds-react';
import { useLokalIntlContext } from '../context/LokalIntlContext';
import { hentTekst } from '../utils/teksthåndtering';

const StyledBanner = styled.div`
  width: 100%;
  height: max-content;
  padding: 0.5rem 1rem 0.5rem 1rem;
  background-color: #c1b5d0;
  border-bottom: 4px solid #826ba1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Banner: React.FC<{ tekstid: string }> = ({ tekstid }) => {
  const intl = useLokalIntlContext();
  return (
    <StyledBanner>
      <Heading size="large">{hentTekst(tekstid, intl)}</Heading>
    </StyledBanner>
  );
};

export default Banner;
