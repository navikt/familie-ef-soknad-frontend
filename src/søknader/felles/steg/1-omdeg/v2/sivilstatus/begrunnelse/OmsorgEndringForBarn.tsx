import React, { useState } from 'react';
import { useLokalIntlContext } from '../../../../../../../context/LokalIntlContext';
import { DatePicker, useDatepicker } from '@navikt/ds-react';
import { hentTekst } from '../../../../../../../utils/søknad';
import { useOmDegV2 } from '../../typer/OmDegContextV2';

export const OmsorgEndringForBarn: React.FC = () => {
  const intl = useLokalIntlContext();
  const { oppdaterSivilstatus } = useOmDegV2();

  const [omsorgEndringDato, settOmsorgEndringDato] = useState<Date | undefined>();

  const omsorgEndringDatePicker = useDatepicker({
    onDateChange: (dato: Date | undefined) => {
      settOmsorgEndringDato(dato);

      oppdaterSivilstatus({
        omsorgEndringDato: dato,
      });
    },
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
