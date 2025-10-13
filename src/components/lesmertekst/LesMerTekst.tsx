import React from 'react';
import { BodyShort, ReadMore } from '@navikt/ds-react';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { hentHTMLTekst, hentTekst } from '../../utils/teksthåndtering';
import styles from './LesMerTekst.module.css';

interface Props {
  halvåpenTekstid?: string;
  åpneTekstid: string;
  innholdTekstid?: string;
  innholdTekst?: string | React.ReactNode;
  html?: boolean;
  testID?: string;
}

export const LesMerTekst: React.FC<Props> = ({
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
      <div className={styles.åpenHjelpetekst}>
        <BodyShort>
          {innholdTekst && innholdTekst}
          {!innholdTekst && innholdTekstid && hentHTMLTekst(innholdTekstid, intl)}
        </BodyShort>
      </div>
    );
  } else {
    return (
      <>
        {halvåpenTekstid && (
          <div className={styles.halvåpenHjelpetekst}>
            <BodyShort>{hentTekst(halvåpenTekstid, intl)}</BodyShort>
          </div>
        )}
        <ReadMore header={hentTekst(åpneTekstid, intl)} data-testid={testID}>
          <BodyShort>
            {innholdTekst && innholdTekst}
            {!innholdTekst && innholdTekstid && html && hentHTMLTekst(innholdTekstid, intl)}
            {!innholdTekst && innholdTekstid && !html && hentHTMLTekst(innholdTekstid, intl)}
          </BodyShort>
        </ReadMore>
      </>
    );
  }
};
