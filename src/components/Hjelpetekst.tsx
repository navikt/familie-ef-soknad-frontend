import React from 'react';
import Lesmerpanel from 'nav-frontend-lesmerpanel';
import styled from 'styled-components/macro';
import LocaleTekst from '../language/LocaleTekst';
import { hentTekst } from '../utils/søknad';
import hiddenIf from '../utils/hiddenIf';
import { useLokalIntlContext } from '../context/LokalIntlContext';
import FormattedHtmlMessage from '../language/FormattedHtmlMessage';
import { BodyShort } from '@navikt/ds-react';

const StyledHjelpetekst = styled.div`
  .lesMerPanel {
    padding: 0;

    &__toggle {
      justify-content: flex-start;

      @media @mobile {
        padding-left: 0;
      }
    }

    &__togglelink {
      flex-direction: row-reverse;

      .chevron--ned {
        margin-top: 0.2rem;
      }

      .chevron--opp {
        margin-top: 0.3rem;
      }
    }
    &__toggleTekst {
      font-size: 16px !important;
    }
    .navds-body-short {
      font-size: 16px !important;
    }
  }
  &.sentrert {
    .lesMerPanel {
      &__togglelink {
        &--erApen {
          margin: auto;
        }
      }
    }
  }
`;

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
  className?: string;
  halvåpenTekstid?: string;
  åpneTekstid: string;
  lukkeTekstid?: string;
  innholdTekstid?: string;
  innholdTekst?: string | React.ReactNode;
  html?: boolean;
}

const Hjelpetekst: React.FC<Props> = ({
  className,
  halvåpenTekstid,
  åpneTekstid,
  lukkeTekstid,
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
          {!innholdTekst && innholdTekstid && (
            <LocaleTekst tekst={innholdTekstid} />
          )}
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
        <StyledHjelpetekst className={className}>
          <Lesmerpanel
            apneTekst={hentTekst(åpneTekstid, intl)}
            lukkTekst={
              lukkeTekstid
                ? hentTekst(lukkeTekstid, intl)
                : hentTekst('knapp.lukk', intl)
            }
          >
            <BodyShort>
              {innholdTekst && innholdTekst}
              {!innholdTekst && innholdTekstid && html && (
                <FormattedHtmlMessage id={innholdTekstid} />
              )}
              {!innholdTekst && innholdTekstid && !html && (
                <LocaleTekst tekst={innholdTekstid} />
              )}
            </BodyShort>
          </Lesmerpanel>
        </StyledHjelpetekst>
      </>
    );
  }
};

export default hiddenIf(Hjelpetekst);
