import React, { FC } from 'react';
import styled from 'styled-components';
import { hentTekst } from '../../utils/søknad';
import { useLokalIntlContext } from '../../context/LokalIntlContext';

const StyledFeilmelding = styled.span`
  color: #ba3a26;
  font-family: 'Source Sans Pro', Arial, sans-serif;
  font-size: 1rem;
  font-style: italic;
  font-weight: 400;
  line-height: 1.375rem;
  margin-bottom: 0;
  margin-top: 0.5rem;

  &.gjemFeilmelding {
    display: none;
  }
`;

interface Props {
  className?: string;
  tekstid: string;
}
const Feilmelding: FC<Props> = ({ className, tekstid }) => {
  const intl = useLokalIntlContext();
  return <StyledFeilmelding className={className}>{hentTekst(tekstid, intl)}</StyledFeilmelding>;
};

export default Feilmelding;
