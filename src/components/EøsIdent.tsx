import React from 'react';
import { Checkbox, Label, ReadMore, TextField, VStack } from '@navikt/ds-react';
import { hentTekstMedEnVariabel } from '../utils/teksthåndtering';
import { useLokalIntlContext } from '../context/LokalIntlContext';
import { IUtenlandsopphold } from '../models/steg/omDeg/medlemskap';

interface Props {
  halvåpenTekstid: string;
  åpneTekstid: string;
  utenlandsopphold: IUtenlandsopphold;
  settUtenlandsopphold: (utenlandsopphold: IUtenlandsopphold) => void;
}

export const EøsIdent: React.FC<Props> = ({
  halvåpenTekstid,
  åpneTekstid,
  utenlandsopphold,
  settUtenlandsopphold,
}) => {
  const intl = useLokalIntlContext();

  if (!utenlandsopphold.land) {
    return null;
  }

  const utenlandskIDNummerTekst = hentTekstMedEnVariabel(
    'medlemskap.periodeBoddIUtlandet.utenlandskIDNummer',
    intl,
    utenlandsopphold.land.verdi
  );

  const settUtenlandskPersonId = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const oppdatertUtenlandsopphold = {
      ...utenlandsopphold,
      personidentEøsLand: {
        label: utenlandskIDNummerTekst,
        verdi: e.target.value,
      },
    };
    settUtenlandsopphold(oppdatertUtenlandsopphold);
  };

  const toggleHarUtenlandskPersonId = (kanIkkeOppgiPersonident: boolean): void => {
    const oppdatertUtenlandsopphold = {
      ...utenlandsopphold,
      kanIkkeOppgiPersonident: kanIkkeOppgiPersonident,
      personidentEøsLand: kanIkkeOppgiPersonident
        ? { label: '', verdi: '' }
        : utenlandsopphold.personidentEøsLand,
    };
    settUtenlandsopphold(oppdatertUtenlandsopphold);
  };

  return (
    <VStack gap={'space-24'}>
      <VStack>
        <Label>{utenlandskIDNummerTekst}</Label>
        <ReadMore header={halvåpenTekstid}>{åpneTekstid}</ReadMore>
      </VStack>
      <TextField
        key={'navn'}
        label={utenlandskIDNummerTekst}
        hideLabel={true}
        type="text"
        onChange={(e) => settUtenlandskPersonId(e)}
        value={utenlandsopphold.personidentEøsLand?.verdi}
        disabled={utenlandsopphold.kanIkkeOppgiPersonident}
        maxLength={32}
      />
      <Checkbox
        checked={utenlandsopphold.kanIkkeOppgiPersonident}
        onChange={() => toggleHarUtenlandskPersonId(!utenlandsopphold.kanIkkeOppgiPersonident)}
      >
        {hentTekstMedEnVariabel(
          'medlemskap.periodeBoddIUtlandet.harIkkeIdNummer',
          intl,
          utenlandsopphold.land.verdi
        )}
      </Checkbox>
    </VStack>
  );
};
