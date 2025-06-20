import React, { useEffect, useState } from 'react';
import { addMonths, addYears, formatISO, subYears } from 'date-fns';
import { useSpråkContext } from '../../context/SpråkContext';
import FeltGruppe from '../gruppe/FeltGruppe';
import { dagensDato, formatIsoDate } from '../../utils/dato';
import { DatePicker, useDatepicker } from '@navikt/ds-react';
import { hentTekst } from '../../utils/søknad';
import { useLokalIntlContext } from '../../context/LokalIntlContext';

export enum DatoBegrensning {
  AlleDatoer = 'AlleDatoer',
  FremtidigeDatoer = 'FremtidigeDatoer',
  TidligereDatoer = 'TidligereDatoer',
  TidligereDatoerOgSeksMånederFrem = 'TidligereDatoerOgSeksMånederFrem',
  FemÅrTidligereOgSeksMånederFrem = 'FemÅrTidligereOgSeksMånederFrem',
  FemtiÅrTidligereOgSeksMånederFrem = 'FemtiÅrTidligereOgSeksMånederFrem',
}

interface Props {
  valgtDato: string | undefined;
  tekstid: string;
  datobegrensning: DatoBegrensning;
  settDato: (dato: string) => void;
}

const Datovelger: React.FC<Props> = ({ tekstid, datobegrensning, valgtDato, settDato }) => {
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
    datobegrensning: DatoBegrensning,
    validate: { isBefore: boolean; isAfter: boolean; isValidDate: boolean },
    settFeilmelding: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (datobegrensning === DatoBegrensning.FremtidigeDatoer && validate.isBefore) {
      settFeilmelding('datovelger.ugyldigDato.kunFremtidigeDatoer');
    } else if (datobegrensning === DatoBegrensning.TidligereDatoer && validate.isAfter) {
      settFeilmelding('datovelger.ugyldigDato.kunTidligereDatoer');
    } else if (!validate.isValidDate) {
      settFeilmelding('datovelger.ugyldigDato');
    } else {
      settFeilmelding('');
    }
  };

  const hentDatobegrensninger = (datobegrensning: DatoBegrensning) => {
    switch (datobegrensning) {
      case DatoBegrensning.AlleDatoer:
        return {
          minDato: formatIsoDate(subYears(dagensDato, 100)),
          maksDato: formatIsoDate(addYears(dagensDato, 100)),
        };
      case DatoBegrensning.FremtidigeDatoer:
        return {
          minDato: formatIsoDate(dagensDato),
          maksDato: formatIsoDate(addYears(dagensDato, 100)),
        };
      case DatoBegrensning.TidligereDatoer:
        return {
          minDato: formatIsoDate(subYears(dagensDato, 100)),
          maksDato: formatIsoDate(dagensDato),
        };
      case DatoBegrensning.TidligereDatoerOgSeksMånederFrem:
        return {
          minDato: formatIsoDate(subYears(dagensDato, 100)),
          maksDato: formatIsoDate(addMonths(dagensDato, 6)),
        };
      case DatoBegrensning.FemÅrTidligereOgSeksMånederFrem:
        return {
          minDato: formatIsoDate(subYears(dagensDato, 5)),
          maksDato: formatIsoDate(addMonths(dagensDato, 6)),
        };
      case DatoBegrensning.FemtiÅrTidligereOgSeksMånederFrem:
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
    <FeltGruppe>
      <DatePicker {...datepickerProps} dropdownCaption>
        <DatePicker.Input
          {...inputProps}
          label={label}
          error={feilmelding && hentTekst(feilmelding, intl)}
          placeholder="DD.MM.YYYY"
        />
      </DatePicker>
    </FeltGruppe>
  );
};

export { Datovelger };
