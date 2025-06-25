import React, { FC } from 'react';
import styled from 'styled-components';
import { FilIkon } from '../assets/FilIkon';
import { BodyShort } from '@navikt/ds-react';

const StyledAlertstripe = styled.div`
  padding-top: 2rem;
  display: flex;
  align-content: center;
  .navds-body-short {
    font-size: 1rem;
  }

  .ikon {
    margin-right: 0.75rem;
    display: flex;
    top: 1rem;
    flex-shrink: 0;
  }
  .tekst {
    margin: auto 0;
    max-width: 37.5rem;
    display: block;
    flex: 1 1;
  }
`;

const AlertStripeDokumentasjon: FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <StyledAlertstripe>
      <FilIkon className={'ikon'} />
      <div className={'tekst'}>
        <BodyShort>{children}</BodyShort>
      </div>
    </StyledAlertstripe>
  );
};

export default AlertStripeDokumentasjon;
