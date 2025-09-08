import React from 'react';
import { ISpørsmål, ISvar } from '../../models/felles/spørsmålogsvar';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { Heading, ReadMore, VStack } from '@navikt/ds-react';
import { hentTekst } from '../../utils/teksthåndtering';

interface Props {
  spørsmål: ISpørsmål;
  settValgteSvar: (spørsmål: ISpørsmål, svarHuketAv: boolean, svar: ISvar) => void;
  valgteSvar: string[];
  brukSvarIdSomVerdi?: boolean;
}

export const CheckboxSpørsmålV2: React.FC<Props> = ({
  spørsmål,
  settValgteSvar,
  valgteSvar,
  brukSvarIdSomVerdi,
}) => {
  const intl = useLokalIntlContext();

  return (
    <VStack>
      <VStack gap={'2'}>
        <Heading size={'xsmall'}>{hentTekst(spørsmål.tekstid, intl)}</Heading>

        {spørsmål.lesmer && (
          <ReadMore header={hentTekst(spørsmål.lesmer.headerTekstid, intl)} size={'small'}>
            {hentTekst(spørsmål.lesmer.innholdTekstid, intl)}
          </ReadMore>
        )}
      </VStack>
    </VStack>
  );
};
