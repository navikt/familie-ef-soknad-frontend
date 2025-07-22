import React from 'react';
import styled from 'styled-components';
import { hentTekst } from '../utils/søknad';
import { useLokalIntlContext } from '../context/LokalIntlContext';
import { BodyShort, ReadMore } from '@navikt/ds-react';
import { hentHTMLTekst } from '../utils/teksthåndtering';

const StyledÅpenHjelpetekst = styled.div`
  .navds-body-short {
    margin-top: 1rem;
    margin-bottom: 1rem;
    font-size: 1rem !important;
  }
`;

const StyledHalvåpenHjelpetekst = styled.div`
  .navds-body-short {
    margin-top: 1rem;
    font-size: 1rem !important;
  }
`;

interface Props {
  halvåpenTekstid?: string;
  åpneTekstid: string;
  innholdTekstid?: string;
  innholdTekst?: string | React.ReactNode;
  html?: boolean;
}

const LesMerTekst: React.FC<Props> = ({
  halvåpenTekstid,
  åpneTekstid,
  innholdTekstid,
  innholdTekst,
  html,
}) => {
  const intl = useLokalIntlContext();

  if (åpneTekstid === '') {
    return (
      <StyledÅpenHjelpetekst>
        <BodyShort>
          {innholdTekst && innholdTekst}
          {!innholdTekst && innholdTekstid && hentTekst(innholdTekstid, intl)}
        </BodyShort>
      </StyledÅpenHjelpetekst>
    );
  } else {
    return (
      <>
        {halvåpenTekstid && (
          <StyledHalvåpenHjelpetekst>
            <BodyShort>{hentTekst(halvåpenTekstid, intl)}</BodyShort>
          </StyledHalvåpenHjelpetekst>
        )}
        <ReadMore header={hentTekst(åpneTekstid, intl)}>
          <BodyShort>
            {innholdTekst && innholdTekst}
            {!innholdTekst && innholdTekstid && html && hentTekst(innholdTekstid, intl)}
            {!innholdTekst && innholdTekstid && !html && hentHTMLTekst(innholdTekstid, intl)}
          </BodyShort>
        </ReadMore>
      </>
    );
  }
};

export default LesMerTekst;
