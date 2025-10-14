import React from 'react';
import { BodyShort, ReadMore } from '@navikt/ds-react';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { hentHTMLTekst, hentTekst } from '../../utils/teksthåndtering';

interface Props {
  åpneTekstid: string;
  innholdTekstid?: string;
  innholdTekst?: string | React.ReactNode;
  html?: boolean;
  testID?: string;
}

export const LesMerTekst: React.FC<Props> = ({
  åpneTekstid,
  innholdTekstid,
  innholdTekst,
  html,
  testID,
}) => {
  const intl = useLokalIntlContext();

  if (åpneTekstid === '') {
    return (
      <BodyShort size={'small'}>
        {innholdTekst && innholdTekst}
        {!innholdTekst && innholdTekstid && hentHTMLTekst(innholdTekstid, intl)}
      </BodyShort>
    );
  } else {
    return (
      <ReadMore header={hentTekst(åpneTekstid, intl)} data-testid={testID}>
        <BodyShort>
          {innholdTekst && innholdTekst}
          {!innholdTekst && innholdTekstid && html && hentHTMLTekst(innholdTekstid, intl)}
          {!innholdTekst && innholdTekstid && !html && hentHTMLTekst(innholdTekstid, intl)}
        </BodyShort>
      </ReadMore>
    );
  }
};
