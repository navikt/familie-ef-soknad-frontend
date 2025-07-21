import React, { useState } from 'react';
import { useLokalIntlContext } from '../../../../../../../context/LokalIntlContext';
import { DatePicker, useDatepicker, VStack } from '@navikt/ds-react';
import { hentTekst } from '../../../../../../../utils/søknad';

export const OmsorgEndringForBarn: React.FC = () => {
  const intl = useLokalIntlContext();

  const [omsorgEndringDato, settOmsorgEndringDato] = useState<Date | undefined>();

  const omsorgEndringDatePicker = useDatepicker({
    onDateChange: settOmsorgEndringDato,
  });

  return (
    <DatePicker {...omsorgEndringDatePicker.datepickerProps}>
      <DatePicker.Input
        {...omsorgEndringDatePicker.inputProps}
        label={hentTekst('sivilstatus.datovelger.endring', intl)}
        placeholder={'DD.MM.YYYY'}
      />
    </DatePicker>
  );
};
