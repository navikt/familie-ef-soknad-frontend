import React, { useEffect, useState } from 'react';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import {
  Checkbox,
  CheckboxGroup,
  Heading,
  TextField,
  VStack,
  DatePicker,
  useDatepicker,
} from '@navikt/ds-react';
import { hentTekst } from '../../../../../utils/søknad';
import { identErGyldig } from '../../../../../utils/validering/validering';

export const OmDenTidligereSamboerenDin: React.FC = () => {
  const intl = useLokalIntlContext();

  const [ident, settIdent] = useState('');
  const [visFeil, settVisFeil] = useState(false);

  const handleCheckboxChange = (val: string[]) => {
    console.info('Checkbox selected:', val);
  };

  const fødselsdato = useDatepicker({
    onDateChange: (date) => console.info('Fødselsdato valgt:', date),
  });

  const flyttetFraDato = useDatepicker({
    toDate: new Date(),
    onDateChange: (date) =>
      console.info('Flyttet fra hverandre dato valgt:', date),
  });

  // Liten debounce som stopper feilmelding fra å dukke opp sekundet bruker skriver.
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (ident.trim() !== '') {
        settVisFeil(!identErGyldig(ident));
      } else {
        settVisFeil(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [ident]);

  return (
    <VStack gap="6" align="start">
      <Heading size="small">
        {hentTekst('sivilstatus.tittel.samlivsbruddAndre', intl)}
      </Heading>

      <TextField label={hentTekst('person.navn', intl)} />

      <TextField
        label={hentTekst('person.ident', intl)}
        value={ident}
        onChange={(e) => settIdent(e.target.value)}
        error={
          visFeil ? hentTekst('person.feilmelding.ident', intl) : undefined
        }
      />

      <CheckboxGroup
        legend={hentTekst('person.checkbox.ident', intl)}
        hideLegend
        onChange={handleCheckboxChange}
      >
        <Checkbox value="Ja">
          {hentTekst('person.checkbox.ident', intl)}
        </Checkbox>
      </CheckboxGroup>

      <DatePicker {...fødselsdato.datepickerProps}>
        <DatePicker.Input
          {...fødselsdato.inputProps}
          label={hentTekst('datovelger.fødselsdato', intl)}
        />
      </DatePicker>

      <DatePicker {...flyttetFraDato.datepickerProps}>
        <DatePicker.Input
          {...flyttetFraDato.inputProps}
          label={hentTekst('sivilstatus.datovelger.flyttetFraHverandre', intl)}
        />
      </DatePicker>
    </VStack>
  );
};
