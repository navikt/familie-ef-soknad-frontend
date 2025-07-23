import React, { useState } from 'react';
import { Select, VStack } from '@navikt/ds-react';
import { JaNeiSpørsmålV2, useJaNeiBoolean } from '../komponenter/JaNeiSpørsmålV2';
import { StegSpørsmål, SvarAlternativ } from '../typer/SpørsmålSvarStruktur';
import { useLokalIntlContext } from '../../../../../../context/LokalIntlContext';
import { useSpråkContext } from '../../../../../../context/SpråkContext';
import { hentLand } from '../../medlemskap/MedlemskapConfig';
import { hentTekst } from '../../../../../../utils/søknad';
import { ILandMedKode } from '../../../../../../models/steg/omDeg/medlemskap';
import { UtenlandsoppholdV2 } from './UtenlandsoppholdV2';

export const MedlemskapV2: React.FC = () => {
  const intl = useLokalIntlContext();
  const [locale] = useSpråkContext();
  const landListe = hentLand(locale);

  const søkerOppholderSegINorgeMedBarn = useJaNeiBoolean();
  const [valgtLand, settValgtLand] = useState<string>('');
  const søkerHarOppholdtSegINorgeSiste5År = useJaNeiBoolean();

  const søkerOppholderSegINorgeMedBarnSpørsmål: StegSpørsmål = {
    id: 'søkerOppholderSegINorge',
    spørsmålKey: 'medlemskap.spm.opphold',
  };
  const hvorOppholderDuOgBarnSpørsmål: StegSpørsmål = {
    id: 'oppholdsland',
    spørsmålKey: 'medlemskap.spm.oppholdsland',
  };
  const søkerHarOppholdtSegINorgeSiste5ÅrSpørsmål: StegSpørsmål = {
    id: 'søkerBosattINorgeSisteTreÅr',
    spørsmålKey: 'medlemskap.spm.bosatt',
  };

  const onSøkerOppholderSegILandMedBarn = (svar: SvarAlternativ) => {
    søkerOppholderSegINorgeMedBarn.handleChange(svar);
    settValgtLand('');
  };
  const onLandEndring = (land: string) => {
    settValgtLand(land);
  };
  const onSøkerHarOppholdtSegINorgeSiste5År = (svar: SvarAlternativ) => {
    søkerHarOppholdtSegINorgeSiste5År.handleChange(svar);
  };

  const visHvorOppholderDuOgBarnSpørsmål = søkerOppholderSegINorgeMedBarn.erNei;
  const visOppholdINorgeSiste5ÅrSpørsmål =
    søkerOppholderSegINorgeMedBarn.erJa || valgtLand.trim() !== '';
  const visUtenlandsopphold = søkerHarOppholdtSegINorgeSiste5År.erNei;

  return (
    <VStack gap={'6'}>
      <JaNeiSpørsmålV2
        spørsmål={søkerOppholderSegINorgeMedBarnSpørsmål}
        onChange={onSøkerOppholderSegILandMedBarn}
      />

      {visHvorOppholderDuOgBarnSpørsmål && (
        <Select
          label={hentTekst(hvorOppholderDuOgBarnSpørsmål.spørsmålKey, intl)}
          value={valgtLand}
          onChange={(event) => {
            onLandEndring(event.target.value);
          }}
        >
          <option value="" disabled>
            {hentTekst('landVelger.alternativ', intl)}
          </option>

          {landListe.map((land: ILandMedKode) => (
            <option key={land.id} value={land.id}>
              {land.svar_tekst}
            </option>
          ))}
        </Select>
      )}

      {visOppholdINorgeSiste5ÅrSpørsmål && (
        <JaNeiSpørsmålV2
          spørsmål={søkerHarOppholdtSegINorgeSiste5ÅrSpørsmål}
          onChange={onSøkerHarOppholdtSegINorgeSiste5År}
        />
      )}

      {visUtenlandsopphold && <UtenlandsoppholdV2 />}
    </VStack>
  );
};
