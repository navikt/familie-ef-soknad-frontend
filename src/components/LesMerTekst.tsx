import React from 'react';
import styled from 'styled-components';
import LocaleTekst from '../language/LocaleTekst';
import { hentTekst } from '../utils/søknad';
import { useLokalIntlContext } from '../context/LokalIntlContext';
import FormattedHtmlMessage from '../language/FormattedHtmlMessage';
import { BodyShort, ReadMore } from '@navikt/ds-react';

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
  testID?: string;
}

const LesMerTekst: React.FC<Props> = ({
  halvåpenTekstid,
  åpneTekstid,
  innholdTekstid,
  innholdTekst,
  html,
  testID,
}) => {
  const intl = useLokalIntlContext();

  if (åpneTekstid === '') {
    return (
      <StyledÅpenHjelpetekst>
        <BodyShort>
          {innholdTekst && innholdTekst}
          {!innholdTekst && innholdTekstid && <LocaleTekst tekst={innholdTekstid} />}
        </BodyShort>
      </StyledÅpenHjelpetekst>
    );
  } else {
    return (
      <>
        {halvåpenTekstid && (
          <StyledHalvåpenHjelpetekst>
            <BodyShort>
              <LocaleTekst tekst={halvåpenTekstid} />
            </BodyShort>
          </StyledHalvåpenHjelpetekst>
        )}
        <ReadMore header={hentTekst(åpneTekstid, intl)} data-testid={testID}>
          <BodyShort>
            {innholdTekst && innholdTekst}
            {!innholdTekst && innholdTekstid && html && (
              <FormattedHtmlMessage id={innholdTekstid} />
            )}
            {!innholdTekst && innholdTekstid && !html && <LocaleTekst tekst={innholdTekstid} />}
          </BodyShort>
        </ReadMore>
      </>
    );
  }
};

export default LesMerTekst;
