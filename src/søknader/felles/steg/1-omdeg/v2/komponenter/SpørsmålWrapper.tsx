import React from 'react';
import { Heading, ReadMore, VStack } from '@navikt/ds-react';
import styles from './SpørsmålWrapper.module.css';
import { useLokalIntlContext } from '../../../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../../../utils/søknad';
import { StegSpørsmål } from './SpørsmålSvarStruktur';

interface Props {
  spørsmål: StegSpørsmål;
  lesMerTittel?: string;
  lesMerTekst?: string;
}

export const SpørsmålWrapper: React.FC<Props> = ({ spørsmål, lesMerTittel, lesMerTekst }) => {
  const intl = useLokalIntlContext();

  const spørsmålTekst = hentTekst(spørsmål.spørsmålKey, intl);

  return (
    <VStack gap="4">
      <Heading size="xsmall" className={styles.heading}>
        {spørsmålTekst}
      </Heading>

      {lesMerTittel && lesMerTekst && <ReadMore header={lesMerTittel}>{lesMerTekst}</ReadMore>}
    </VStack>
  );
};
