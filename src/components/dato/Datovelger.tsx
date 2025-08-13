import React, { useEffect, useState } from 'react';
import { addMonths, addYears, formatISO, subYears } from 'date-fns';
import { useSpråkContext } from '../../context/SpråkContext';
import { dagensDato, formatIsoDate } from '../../utils/dato';
import { DatePicker, useDatepicker } from '@navikt/ds-react';
import { hentTekst } from '../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../context/LokalIntlContext';

export enum GyldigeDatoer {
  alle = 'alle',
  fremtidige = 'fremtidige',
  tidligere = 'tidligere',
  tidligereOgSeksMånederFrem = 'tidligereOgSeksMånederFrem',
  femÅrTidligereOgSeksMånederFrem = 'femÅrTidligereOgSeksMånederFrem',
  femtiÅrTidligereOgSeksMånederFrem = 'femtiÅrTidligereOgSeksMånederFrem',
}

interface Props {
  valgtDato: string | undefined;
  tekstid: string;
  datobegrensning: GyldigeDatoer;
  settDato: (dato: string) => void;
  testId?: string;
}

export const Datovelger: React.FC<Props> = ({
  tekstid,
  datobegrensning,
  valgtDato,
  settDato,
  testId,
}) => {
  const [locale] = useSpråkContext();
  const [_dato, _settDato] = useState<string>(valgtDato ? valgtDato : '');
  const intl = useLokalIntlContext();
  const [feilmelding, settFeilmelding] = useState<string>('');

  useEffect(() => {
    settDato(_dato);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_dato]);

  const datoVisningsverdi = _dato ? new Date(_dato) : undefined;
  const label = hentTekst(tekstid, intl);

  const settFeilmeldingBasertPåValidering = (
    datobegrensning: GyldigeDatoer,
    validate: { isBefore: boolean; isAfter: boolean; isValidDate: boolean },
    settFeilmelding: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (datobegrensning === GyldigeDatoer.fremtidige && validate.isBefore) {
      settFeilmelding('datovelger.ugyldigDato.kunFremtidigeDatoer');
    } else if (datobegrensning === GyldigeDatoer.tidligere && validate.isAfter) {
      settFeilmelding('datovelger.ugyldigDato.kunTidligereDatoer');
    } else if (!validate.isValidDate) {
      settFeilmelding('datovelger.ugyldigDato');
    } else {
      settFeilmelding('');
    }
  };

  const hentDatobegrensninger = (datobegrensning: GyldigeDatoer) => {
    switch (datobegrensning) {
      case GyldigeDatoer.alle:
        return {
          minDato: formatIsoDate(subYears(dagensDato, 100)),
          maksDato: formatIsoDate(addYears(dagensDato, 100)),
        };
      case GyldigeDatoer.fremtidige:
        return {
          minDato: formatIsoDate(dagensDato),
          maksDato: formatIsoDate(addYears(dagensDato, 100)),
        };
      case GyldigeDatoer.tidligere:
        return {
          minDato: formatIsoDate(subYears(dagensDato, 100)),
          maksDato: formatIsoDate(dagensDato),
        };
      case GyldigeDatoer.tidligereOgSeksMånederFrem:
        return {
          minDato: formatIsoDate(subYears(dagensDato, 100)),
          maksDato: formatIsoDate(addMonths(dagensDato, 6)),
        };
      case GyldigeDatoer.femÅrTidligereOgSeksMånederFrem:
        return {
          minDato: formatIsoDate(subYears(dagensDato, 5)),
          maksDato: formatIsoDate(addMonths(dagensDato, 6)),
        };
      case GyldigeDatoer.femtiÅrTidligereOgSeksMånederFrem:
        return {
          minDato: formatIsoDate(subYears(dagensDato, 50)),
          maksDato: formatIsoDate(addMonths(dagensDato, 6)),
        };
    }
  };

  const tilLocaleDateString = (dato: Date) => formatISO(dato, { representation: 'date' });

  const { datepickerProps, inputProps } = useDatepicker({
    fromDate: new Date(hentDatobegrensninger(datobegrensning).minDato),
    toDate: new Date(hentDatobegrensninger(datobegrensning).maksDato),
    onDateChange: (dato) => _settDato(dato ? tilLocaleDateString(dato) : ''),
    onValidate: (validate) =>
      settFeilmeldingBasertPåValidering(datobegrensning, validate, settFeilmelding),
    locale: locale,
    defaultSelected: datoVisningsverdi,
  });

  return (
    <DatePicker {...datepickerProps} dropdownCaption>
      <DatePicker.Input
        {...inputProps}
        label={label}
        error={feilmelding && hentTekst(feilmelding, intl)}
        placeholder="DD.MM.YYYY"
        data-testid={testId}
      />
    </DatePicker>
  );
};
