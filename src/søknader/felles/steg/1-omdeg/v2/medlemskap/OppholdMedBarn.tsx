import React, { useState } from 'react';
import { StegSpørsmål } from '../typer/SpørsmålSvarStruktur';
import { Select } from '@navikt/ds-react';
import { hentTekst } from '../../../../../../utils/søknad';
import { useLokalIntlContext } from '../../../../../../context/LokalIntlContext';
import { useSpråkContext } from '../../../../../../context/SpråkContext';
import { hentLand } from '../../medlemskap/MedlemskapConfig';
import { ILandMedKode } from '../../../../../../models/steg/omDeg/medlemskap';

export const OppholdMedBarn: React.FC = () => {
  const intl = useLokalIntlContext();
  const [locale] = useSpråkContext();
  const landListe = hentLand(locale);

  const [valgtLand, settValgtLand] = useState<string>('');

  const hvorOppholderDuOgBarnSpørsmål: StegSpørsmål = {
    id: 'oppholdsland',
    spørsmålKey: 'medlemskap.spm.oppholdsland',
  };

  const onLandEndring = (land: string) => {
    settValgtLand(land);
  };

  return (
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
  );
};
