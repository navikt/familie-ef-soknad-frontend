import React from 'react';
import { Checkbox, Label, ReadMore } from '@navikt/ds-react';
import { TextFieldMedBredde } from './TextFieldMedBredde';
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
    <div>
      <Label>{utenlandskIDNummerTekst}</Label>
      <ReadMore size={'small'} header={halvåpenTekstid}>
        {åpneTekstid}
      </ReadMore>
      <TextFieldMedBredde
        className={'inputfelt-tekst'}
        key={'navn'}
        label={utenlandskIDNummerTekst}
        hideLabel={true}
        type="text"
        bredde={'L'}
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
    </div>
  );
};
