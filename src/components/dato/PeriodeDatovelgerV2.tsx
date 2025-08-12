import React from 'react';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { DatePicker, Heading, HStack, ReadMore, useDatepicker, VStack } from '@navikt/ds-react';
import { hentTekst } from '../../utils/teksthåndtering';

interface Props {
  tekstKey: string;
  lesMerTittelKey?: string;
  lesMerBeskrivelseKey?: string;
}

export const PeriodeDatovelgerV2: React.FC<Props> = ({
  tekstKey,
  lesMerTittelKey,
  lesMerBeskrivelseKey,
}) => {
  const intl = useLokalIntlContext();

  const fraPeriodeDato = useDatepicker({
    onDateChange: (dato: Date | undefined) => {},
  });

  const tilPeriodeDato = useDatepicker({
    onDateChange: (dato: Date | undefined) => {},
  });

  const visLesMer = lesMerTittelKey && lesMerBeskrivelseKey;

  return (
    <VStack gap={'6'}>
      <Heading size={'xsmall'}>{hentTekst(tekstKey, intl)}</Heading>

      {visLesMer && (
        <ReadMore header={hentTekst(lesMerTittelKey, intl)}>
          {hentTekst(lesMerBeskrivelseKey, intl)}
        </ReadMore>
      )}

      <HStack gap={'6'}>
        <DatePicker dropdownCaption {...fraPeriodeDato.datepickerProps}>
          <DatePicker.Input
            {...fraPeriodeDato.inputProps}
            label="Fra og med periode velger"
            placeholder={'DD.MM.YYYY'}
          />
        </DatePicker>

        <DatePicker dropdownCaption {...tilPeriodeDato.datepickerProps}>
          <DatePicker.Input
            {...tilPeriodeDato.inputProps}
            label="Til og med periode velger"
            placeholder={'DD.MM.YYYY'}
          />
        </DatePicker>
      </HStack>
    </VStack>
  );
};
