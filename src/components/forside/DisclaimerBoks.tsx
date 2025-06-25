import { BodyShort, ConfirmationPanel, Heading } from '@navikt/ds-react';
import styled from 'styled-components';
import { hentBeskjedMedNavn } from '../../utils/språk';
import { hentTekst } from '../../utils/søknad';
import React from 'react';
import { useLokalIntlContext } from '../../context/LokalIntlContext';

const StyledConfirmationPanel = styled(ConfirmationPanel)`
  margin-bottom: 2rem;
`;

const DisclaimerTittel = styled(Heading)`
  margin-bottom: 1rem;
`;

export const DisclaimerBoks: React.FC<{
  navn: string;
  tekst: string;
  harBekreftet: boolean;
  settBekreftelse: (bekreftet: boolean) => void;
}> = ({ navn, tekst, harBekreftet, settBekreftelse }) => {
  const intl = useLokalIntlContext();
  return (
    <>
      <DisclaimerTittel level="2" size="small">
        {hentTekst('skjema.forside.disclaimer.tittel', intl)}
      </DisclaimerTittel>
      <StyledConfirmationPanel
        checked={!!harBekreftet}
        label={hentBeskjedMedNavn(navn, intl.formatMessage({ id: 'side.bekreftelse' }))}
        onChange={() => settBekreftelse(!harBekreftet)}
      >
        <BodyShort>{hentTekst(tekst, intl)}</BodyShort>
      </StyledConfirmationPanel>
    </>
  );
};
