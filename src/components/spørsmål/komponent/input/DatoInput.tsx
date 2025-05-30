import React from 'react';
import {
  DatePicker,
  useDatepicker,
  useRangeDatepicker,
  HStack,
} from '@navikt/ds-react';
import { hentTekst } from '../../../../utils/søknad';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';

interface EnkelDatoVerdi {
  type: 'enkel';
  dato: Date | undefined;
}

interface PeriodeVerdi {
  type: 'periode';
  fra: Date | undefined;
  til: Date | undefined;
}

type DatoInputVerdi = EnkelDatoVerdi | PeriodeVerdi;

interface DatoInputProps {
  label: string;
  verdi: DatoInputVerdi;
  onChange: (verdi: DatoInputVerdi) => void;
  tillaterDatoTilbakeITid?: boolean;
}

export const DatoInput: React.FC<DatoInputProps> = ({
  label,
  verdi,
  onChange,
  tillaterDatoTilbakeITid = true,
}) => {
  const intl = useLokalIntlContext();

  const dagensDato = new Date();
  const fraDato = tillaterDatoTilbakeITid ? undefined : dagensDato;

  const enkelDato = useDatepicker({
    fromDate: fraDato,
    defaultSelected: verdi.type === 'enkel' ? verdi.dato : undefined,
    onDateChange: (dato) => {
      onChange({ type: 'enkel', dato });
    },
  });

  const periodeDato = useRangeDatepicker({
    fromDate: fraDato,
    defaultSelected:
      verdi.type === 'periode' ? { from: verdi.fra, to: verdi.til } : undefined,
    onRangeChange: (range) => {
      onChange({ type: 'periode', fra: range?.from, til: range?.to });
    },
  });

  if (verdi.type === 'periode') {
    const { datepickerProps, fromInputProps, toInputProps } = periodeDato;

    return (
      <DatePicker {...datepickerProps}>
        <HStack gap="4" wrap>
          <DatePicker.Input
            {...fromInputProps}
            label={hentTekst('periode.fra', intl)}
          />
          <DatePicker.Input
            {...toInputProps}
            label={hentTekst('periode.til', intl)}
          />
        </HStack>
      </DatePicker>
    );
  }

  const { datepickerProps, inputProps } = enkelDato;

  return (
    <DatePicker {...datepickerProps}>
      <DatePicker.Input {...inputProps} label={label} />
    </DatePicker>
  );
};
