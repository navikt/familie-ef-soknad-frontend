import React from 'react';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { DatePicker, Heading, HStack, ReadMore, useDatepicker, VStack } from '@navikt/ds-react';
import { hentTekst } from '../../utils/teksthåndtering';

interface Props {
  headerKey?: string;

  lesMerTittelKey?: string;
  lesMerBeskrivelseKey?: string;

  fraPeriodeVelgerKey?: string;
  tilPeriodeVelgerKey?: string;
}

export const PeriodeDatovelgerV2: React.FC<Props> = ({
  headerKey,
  lesMerTittelKey,
  lesMerBeskrivelseKey,
  fraPeriodeVelgerKey,
  tilPeriodeVelgerKey,
}) => {
  const intl = useLokalIntlContext();

  const fraPeriodeVelgerLabel = fraPeriodeVelgerKey
    ? hentTekst(fraPeriodeVelgerKey, intl)
    : hentTekst('periode.fra', intl);

  const tilPeriodeVelgerLabel = tilPeriodeVelgerKey
    ? hentTekst(tilPeriodeVelgerKey, intl)
    : hentTekst('periode.til', intl);

  const fraPeriodeErrorTekst = 'Jeg er en feil!';
  const tilPeriodeErrorTekst = 'Jeg er også feil!';

  const fraPeriodeDato = useDatepicker({
    onDateChange: (dato: Date | undefined) => {},
  });

  const tilPeriodeDato = useDatepicker({
    onDateChange: (dato: Date | undefined) => {},
  });

  const visHeader = headerKey;
  const visLesMer = lesMerTittelKey && lesMerBeskrivelseKey;

  return (
    <VStack gap={'6'}>
      {visHeader && <Heading size={'xsmall'}>{hentTekst(headerKey, intl)}</Heading>}

      {visLesMer && (
        <ReadMore header={hentTekst(lesMerTittelKey, intl)}>
          {hentTekst(lesMerBeskrivelseKey, intl)}
        </ReadMore>
      )}

      <HStack gap={'6'}>
        <DatePicker dropdownCaption {...fraPeriodeDato.datepickerProps}>
          <DatePicker.Input
            {...fraPeriodeDato.inputProps}
            label={fraPeriodeVelgerLabel}
            placeholder={'DD.MM.YYYY'}
            error={fraPeriodeErrorTekst}
          />
        </DatePicker>

        <DatePicker dropdownCaption {...tilPeriodeDato.datepickerProps}>
          <DatePicker.Input
            {...tilPeriodeDato.inputProps}
            label={tilPeriodeVelgerLabel}
            placeholder={'DD.MM.YYYY'}
            error={tilPeriodeErrorTekst}
          />
        </DatePicker>
      </HStack>
    </VStack>
  );
};
