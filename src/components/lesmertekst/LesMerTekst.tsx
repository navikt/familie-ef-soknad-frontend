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
  onÅpneEndret?: (åpen: boolean, headerTekst: string) => void;
}

export const LesMerTekst: React.FC<Props> = ({
  åpneTekstid,
  innholdTekstid,
  innholdTekst,
  html,
  testID,
  onÅpneEndret,
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
    const headerTekst = hentTekst(åpneTekstid, intl);
    return (
      <ReadMore
        header={headerTekst}
        data-testid={testID}
        onOpenChange={(åpen) => onÅpneEndret?.(åpen, headerTekst)}
      >
        <BodyShort>
          {innholdTekst && innholdTekst}
          {!innholdTekst && innholdTekstid && html && hentHTMLTekst(innholdTekstid, intl)}
          {!innholdTekst && innholdTekstid && !html && hentHTMLTekst(innholdTekstid, intl)}
        </BodyShort>
      </ReadMore>
    );
  }
};
