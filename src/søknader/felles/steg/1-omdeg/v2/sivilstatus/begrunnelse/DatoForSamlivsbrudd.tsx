import React, { useState } from 'react';
import { Alert, DatePicker, useDatepicker, VStack } from '@navikt/ds-react';
import { hentTekst } from '../../../../../../../utils/søknad';
import { useLokalIntlContext } from '../../../../../../../context/LokalIntlContext';

export const DatoForSamlivsbrudd: React.FC = () => {
  const intl = useLokalIntlContext();

  const [samlivsbruddDato, settSamlivsbruddDato] = useState<Date | undefined>();

  const { datepickerProps, inputProps } = useDatepicker({
    toDate: new Date(),
    onDateChange: (dato: Date | undefined) => {
      settSamlivsbruddDato(dato);
    },
  });

  return (
    <VStack gap={'6'}>
      <DatePicker {...datepickerProps}>
        <DatePicker.Input
          {...inputProps}
          label={hentTekst('sivilstatus.datovelger.samlivsbrudd', intl)}
          placeholder="DD.MM.YYYY"
        />
      </DatePicker>
      <Alert variant={'info'} size={'small'} inline>
        {hentTekst('sivilstatus.alert.samlivsbrudd', intl)}
      </Alert>
      )
    </VStack>
  );
};
