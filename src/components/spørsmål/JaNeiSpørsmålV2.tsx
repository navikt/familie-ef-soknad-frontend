import React from 'react';
import { SpørsmålWrapper } from './SpørsmålWrapper';
import { RadioTile } from './input/RadioTile';

interface Props {
  tittel: string;
  lesMerTittel?: string;
  lesMerTekst?: string;
}

export const JaNeiSpørsmålV2: React.FC<Props> = ({ tittel, lesMerTittel, lesMerTekst }) => {
  const svarAlternativer = ['ja', 'nei'];

  return (
    <SpørsmålWrapper tittel={tittel} lesMerTittel={lesMerTittel} lesMerTekst={lesMerTekst}>
      <RadioTile
        legend={tittel}
        svarAlternativer={svarAlternativer}
        radioTileLayoutDirection={'horizontal'}
      />
    </SpørsmålWrapper>
  );
};
