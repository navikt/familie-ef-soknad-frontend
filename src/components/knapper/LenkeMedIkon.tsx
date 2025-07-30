import React from 'react';
import styled from 'styled-components';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { BodyShort } from '@navikt/ds-react';
import { hentHTMLTekst } from '../../utils/teksthåndtering';

const StyledLenkeMedIkon = styled.div`
  .lenke-knapp {
    display: flex;
    margin-top: 2rem;
    color: @navBla;
    text-decoration: underline;
    border: none;
    text-align: left;
    background: none;

    .navds-body-short {
      margin-left: 1rem;
    }

    &:hover {
      text-decoration: none;
      cursor: pointer;
    }
  }
`;

interface Props {
  onClick: () => void;
  tekst_id: string;
  ikon: string;
}

const LenkeMedIkon: React.FC<Props> = ({ onClick, tekst_id, ikon }) => {
  const intl = useLokalIntlContext();

  return (
    <StyledLenkeMedIkon>
      <button className="lenke-knapp" onClick={onClick}>
        <img alt="Endre informasjon" src={ikon} />
        <BodyShort>{hentHTMLTekst(tekst_id, intl)}</BodyShort>
      </button>
    </StyledLenkeMedIkon>
  );
};

export default LenkeMedIkon;
