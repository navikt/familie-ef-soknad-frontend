import {
  addDays,
  addMonths,
  addYears,
  format,
  formatISO,
  isAfter,
  isValid,
  parse,
  setHours,
  setMinutes,
  startOfDay,
  startOfToday,
  subMonths,
  subYears,
} from 'date-fns';
import { nb } from 'date-fns/locale';
import { IPeriode } from '../models/felles/periode';

import { GyldigeDatoer } from '../components/dato/GyldigeDatoer';

export const STANDARD_DATOFORMAT = 'dd.MM.yyyy';
export const FØDSELSNUMMER_DATOFORMAT = 'ddMMyy';
export const DATO_OG_TIME = 'HH:mm, dd.MM.yyyy';

const erGyldigFormat = (verdi: string) => {
  const YYYYMMDD = /^\d{4}-\d{2}-\d{2}$/;

  if (verdi && String(verdi).match(YYYYMMDD)) {
    return true;
  } else {
    return false;
  }
};

export const parseDate = (date: string) => {
  return parse(date, STANDARD_DATOFORMAT, new Date());
};

export const formatDate = (date: Date) => {
  return format(date, STANDARD_DATOFORMAT);
};

export const formatIsoDate = (date: Date) => {
  return formatISO(date, { representation: 'date' });
};

export const formatIsoToStandardFormat = (isoDate: string) => {
  const date = new Date(isoDate);
  return isValid(date) ? format(date, STANDARD_DATOFORMAT) : '';
};

export const formatDateFnr = (date: Date) => {
  return format(date, FØDSELSNUMMER_DATOFORMAT);
};

export const formatDateHour = (date: Date) => {
  return format(date, DATO_OG_TIME);
};

export const datoTilStreng = (date: Date): string => {
  return startOfDay(date).toISOString();
};

export const strengTilDato = (datoStreng: string): Date => {
  return startOfDay(new Date(datoStreng));
};

export const nullableStrengTilDato = (dato?: string): Date | undefined => {
  return dato ? strengTilDato(dato) : undefined;
};

export const tilDato = (dato: string | Date): Date => {
  return typeof dato === 'string' ? startOfDay(new Date(dato)) : dato;
};

export const formatMånederTilbake = (dato: Date, antallMåneder: number) => {
  const nyDato = subMonths(dato, antallMåneder);

  return format(nyDato, 'MMMM yyyy', { locale: nb });
};

export const dagensDato = startOfToday();

export const dagensIsoDatoMinusMåneder = (antallMåneder: number) =>
  formatIsoDate(subMonths(dagensDato, antallMåneder));

export const dagensIsoDatoPlussMåneder = (antallMåneder: number) =>
  formatIsoDate(addMonths(dagensDato, antallMåneder));

export const dagensDatoMedTidspunktStreng = new Date().toISOString();

export const erGyldigDato = (verdi: string | undefined): boolean => {
  return verdi ? erGyldigFormat(verdi) && isValid(new Date(verdi)) : false;
};

// Vedlegg er lagret ut neste døgn
export const erVedleggstidspunktGyldig = (verdi: string): boolean => {
  const grenseTidForVedlegg = addDays(setMinutes(setHours(new Date(verdi), 23), 59), 1);
  return isAfter(grenseTidForVedlegg, dagensDato);
};

export const erPeriodeGyldig = (periode: IPeriode | undefined): boolean => {
  return erGyldigDato(periode?.fra.verdi) && erGyldigDato(periode?.til.verdi);
};

export const erEnMånedTilbakeITid = (dato: string): boolean => {
  return !isAfter(strengTilDato(dato), addMonths(dagensDato, -1));
};

export const nåværendeÅr = new Date().getFullYear();

export const erNåværendeMånedMellomMåneder = (startMåned: number, sluttMåned: number): boolean => {
  const nåværendeDato = new Date();
  const nåværendeMåned = nåværendeDato.getMonth() + 1;

  if (sluttMåned < startMåned) {
    return (
      (nåværendeMåned >= startMåned && nåværendeMåned <= 12) ||
      (nåværendeMåned >= 1 && nåværendeMåned <= sluttMåned)
    );
  } else {
    return nåværendeMåned >= startMåned && nåværendeMåned <= sluttMåned;
  }
};

export const hentDatobegrensninger = (datobegrensning: GyldigeDatoer) => {
  switch (datobegrensning) {
    case GyldigeDatoer.alle:
      return {};
    case GyldigeDatoer.fremtidige:
      return {
        minDate: new Date(),
        maxDate: addYears(new Date(), 100),
      };
    case GyldigeDatoer.tidligere:
      return {
        minDate: subYears(new Date(), 100),
        maxDate: new Date(),
      };
    case GyldigeDatoer.tidligereOgSeksMånederFrem:
      return {
        minDate: subYears(new Date(), 100),
        maxDate: addMonths(new Date(), 6),
      };

    case GyldigeDatoer.femÅrTidligereOgSeksMånederFrem:
      return {
        minDate: subYears(new Date(), 5),
        maxDate: addMonths(new Date(), 6),
      };

    case GyldigeDatoer.femtiÅrTidligereOgSeksMånederFrem:
      return {
        minDate: subYears(new Date(), 50),
        maxDate: addMonths(new Date(), 6),
      };
  }
};
