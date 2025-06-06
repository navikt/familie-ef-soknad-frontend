import React from 'react';
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

export const OmDenTidligereSamboerenDin: React.FC = () => {
  const intl = useLokalIntlContext();

  const personIdentErrorText: string | undefined = hentTekst(
    'person.feilmelding.ident',
    intl
  );

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

  return (
    <VStack gap="6" align="start">
      <Heading size="small">
        {hentTekst('sivilstatus.tittel.samlivsbruddAndre', intl)}
      </Heading>

      <TextField label={hentTekst('person.navn', intl)} />

      <TextField
        label={hentTekst('person.ident', intl)}
        error={personIdentErrorText}
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
