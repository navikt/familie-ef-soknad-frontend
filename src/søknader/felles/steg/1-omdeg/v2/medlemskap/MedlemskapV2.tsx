import React from 'react';
import { VStack } from '@navikt/ds-react';
import {
  JaNeiSpørsmålV2,
  useJaNeiBoolean,
} from '../../../../../../components/spørsmål/v2/JaNeiSpørsmålV2';
import { StegSpørsmål, SvarAlternativ } from '../typer/SpørsmålSvarStruktur';
import { OppholdMedBarn } from './OppholdMedBarn';

export const MedlemskapV2: React.FC = () => {
  const søkerOppholderSegINorgeMedBarn = useJaNeiBoolean();
  const søkerHarOppholdtSegINorgeSiste5År = useJaNeiBoolean();

  const søkerOppholderSegINorgeMedBarnSpørsmål: StegSpørsmål = {
    id: 'søkerOppholderSegINorge',
    spørsmålKey: 'medlemskap.spm.opphold',
  };
  const søkerHarOppholdtSegINorgeSiste5ÅrSpørsmål: StegSpørsmål = {
    id: 'søkerBosattINorgeSisteTreÅr',
    spørsmålKey: 'medlemskap.spm.bosatt',
  };

  const onSøkerOppholderSegILandMedBarn = (svar: SvarAlternativ) => {
    søkerOppholderSegINorgeMedBarn.handleChange(svar);
  };
  const onSøkerHarOppholdtSegINorgeSiste5År = (svar: SvarAlternativ) => {
    søkerHarOppholdtSegINorgeSiste5År.handleChange(svar);
  };

  const visHvorOppholderDuOgBarnSpørsmål = søkerOppholderSegINorgeMedBarn.erNei;
  const visOppholdINorgeSiste5ÅrSpørsmål = true;

  return (
    <VStack gap={'6'}>
      <JaNeiSpørsmålV2
        spørsmål={søkerOppholderSegINorgeMedBarnSpørsmål}
        onChange={onSøkerOppholderSegILandMedBarn}
      />

      {visHvorOppholderDuOgBarnSpørsmål && <OppholdMedBarn />}

      {visOppholdINorgeSiste5ÅrSpørsmål && (
        <JaNeiSpørsmålV2
          spørsmål={søkerHarOppholdtSegINorgeSiste5ÅrSpørsmål}
          onChange={onSøkerHarOppholdtSegINorgeSiste5År}
        />
      )}
    </VStack>
  );
};
