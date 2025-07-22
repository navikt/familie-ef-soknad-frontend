import React from 'react';
import { VStack } from '@navikt/ds-react';
import {
  JaNeiSpørsmålV2,
  useJaNeiBoolean,
} from '../../../../../../components/spørsmål/v2/JaNeiSpørsmålV2';
import { StegSpørsmål, SvarAlternativ } from '../typer/SpørsmålSvarStruktur';

export const MedlemskapV2: React.FC = () => {
  const søkerOppholderSegINorgeMedBarn = useJaNeiBoolean();

  const søkerOppholderSegINorgeMedBarnSpørsmål: StegSpørsmål = {
    id: 'søkerOppholderSegINorge',
    spørsmålKey: 'medlemskap.spm.opphold',
  };

  const onSøkerOppholderSegILandMedBarn = (svar: SvarAlternativ) => {
    søkerOppholderSegINorgeMedBarn.handleChange(svar);
  };

  return (
    <VStack gap={'6'}>
      <JaNeiSpørsmålV2
        spørsmål={søkerOppholderSegINorgeMedBarnSpørsmål}
        onChange={onSøkerOppholderSegILandMedBarn}
      />
    </VStack>
  );
};
