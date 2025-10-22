import React, { useEffect, useState } from 'react';
import { addMonths, addYears, formatISO, subYears } from 'date-fns';
import { useSpråkContext } from '../../context/SpråkContext';
import { dagensDato, formatIsoDate } from '../../utils/dato';
import { DatePicker, useDatepicker } from '@navikt/ds-react';
import { hentTekst } from '../../utils/teksthåndtering';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { GyldigeDatoer } from './GyldigeDatoer';

interface Props {
  valgtDato: string | undefined;
  tekstid: string;
  gyldigeDatoer: GyldigeDatoer;
  settDato: (dato: string) => void;
  testId?: string;
}

export const Datovelger: React.FC<Props> = ({
  tekstid,
  gyldigeDatoer,
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
  }, [_dato]);

  const datoVisningsverdi = _dato ? new Date(_dato) : undefined;
  const label = hentTekst(tekstid, intl);

  const settFeilmeldingBasertPåValidering = (
    gyldigeDatoer: GyldigeDatoer,
    validate: { isBefore: boolean; isAfter: boolean; isValidDate: boolean },
    settFeilmelding: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (gyldigeDatoer === GyldigeDatoer.Fremtidige && validate.isBefore) {
      settFeilmelding('datovelger.ugyldigDato.kunFremtidigeDatoer');
    } else if (gyldigeDatoer === GyldigeDatoer.Tidligere && validate.isAfter) {
      settFeilmelding('datovelger.ugyldigDato.kunTidligereDatoer');
    } else if (!validate.isValidDate) {
      settFeilmelding('datovelger.ugyldigDato');
    } else {
      settFeilmelding('');
    }
  };

  const hentGyldigeDatoer = (gyldigeDatoer: GyldigeDatoer) => {
    switch (gyldigeDatoer) {
      case GyldigeDatoer.Alle:
        return {
          minDato: formatIsoDate(subYears(dagensDato, 100)),
          maksDato: formatIsoDate(addYears(dagensDato, 100)),
        };
      case GyldigeDatoer.Fremtidige:
        return {
          minDato: formatIsoDate(dagensDato),
          maksDato: formatIsoDate(addYears(dagensDato, 100)),
        };
      case GyldigeDatoer.Tidligere:
        return {
          minDato: formatIsoDate(subYears(dagensDato, 100)),
          maksDato: formatIsoDate(dagensDato),
        };
      case GyldigeDatoer.TidligereOgSeksMånederFrem:
        return {
          minDato: formatIsoDate(subYears(dagensDato, 100)),
          maksDato: formatIsoDate(addMonths(dagensDato, 6)),
        };
      case GyldigeDatoer.FemÅrTidligereOgSeksMånederFrem:
        return {
          minDato: formatIsoDate(subYears(dagensDato, 5)),
          maksDato: formatIsoDate(addMonths(dagensDato, 6)),
        };
      case GyldigeDatoer.FemtiÅrTidligereOgSeksMånederFrem:
        return {
          minDato: formatIsoDate(subYears(dagensDato, 50)),
          maksDato: formatIsoDate(addMonths(dagensDato, 6)),
        };
    }
  };

  const tilLocaleDateString = (dato: Date) => formatISO(dato, { representation: 'date' });

  const { datepickerProps, inputProps } = useDatepicker({
    fromDate: new Date(hentGyldigeDatoer(gyldigeDatoer).minDato),
    toDate: new Date(hentGyldigeDatoer(gyldigeDatoer).maksDato),
    onDateChange: (dato) => _settDato(dato ? tilLocaleDateString(dato) : ''),
    onValidate: (validate) =>
      settFeilmeldingBasertPåValidering(gyldigeDatoer, validate, settFeilmelding),
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
