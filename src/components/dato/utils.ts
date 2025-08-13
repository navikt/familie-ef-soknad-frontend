import { addMonths, addYears, isAfter, isBefore, isEqual, subYears } from 'date-fns';
import { dagensDato, erGyldigDato, strengTilDato } from '../../utils/dato';
import { IPeriode } from '../../models/felles/periode';
import { DatoBegrensning } from './Datovelger';

type DatoGrenser = {
  min: Date;
  maks: Date;
};

const DATO_GRENSER: Record<DatoBegrensning, () => DatoGrenser | undefined> = {
  [DatoBegrensning.AlleDatoer]: () => undefined,

  [DatoBegrensning.FremtidigeDatoer]: () => ({
    min: dagensDato,
    maks: addYears(dagensDato, 100),
  }),

  [DatoBegrensning.TidligereDatoer]: () => ({
    min: subYears(dagensDato, 100),
    maks: dagensDato,
  }),

  [DatoBegrensning.TidligereDatoerOgSeksMånederFrem]: () => ({
    min: subYears(dagensDato, 100),
    maks: addMonths(dagensDato, 6),
  }),

  [DatoBegrensning.FemÅrTidligereOgSeksMånederFrem]: () => ({
    min: subYears(dagensDato, 5),
    maks: addMonths(dagensDato, 6),
  }),

  [DatoBegrensning.FemtiÅrTidligereOgSeksMånederFrem]: () => ({
    min: subYears(dagensDato, 50),
    maks: addMonths(dagensDato, 6),
  }),
};

const erDatoInnenforDatoGrense = (dato: Date, datoGrense: DatoGrenser): boolean => {
  return !isBefore(dato, datoGrense.min) && !isAfter(dato, datoGrense.maks);
};

export const erDatoInnenforDatoBegrensning = (
  dato: string,
  datoBegrensning: DatoBegrensning
): boolean => {
  if (!dato) return false;

  const grenser = DATO_GRENSER[datoBegrensning]();
  if (!grenser) return true;

  return erDatoInnenforDatoGrense(strengTilDato(dato), grenser);
};

export const erDatoGyldigOgInnenforDatoBegrensning = (
  dato: string,
  datobegrensning: DatoBegrensning
): boolean => {
  return erGyldigDato(dato) && erDatoInnenforDatoBegrensning(dato, datobegrensning);
};

export const erPeriodeInnenforDatoBegrensning = (
  periode: IPeriode,
  datobegrensning: DatoBegrensning
): boolean => {
  return (
    erDatoInnenforDatoBegrensning(periode.fra.verdi, datobegrensning) &&
    erDatoInnenforDatoBegrensning(periode.til.verdi, datobegrensning)
  );
};

export const erPeriodeGyldigOgInnenforDatoBegrensning = (
  periode: IPeriode,
  datobegrensning: DatoBegrensning
): boolean => {
  const { fra, til } = periode;

  if (!erGyldigDato(fra.verdi) || !erGyldigDato(til.verdi)) {
    return false;
  }

  const fraDato = fra.verdi ? strengTilDato(fra.verdi) : undefined;
  const tilDato = til.verdi ? strengTilDato(til.verdi) : undefined;

  if (!fraDato || !tilDato) {
    return false;
  }

  const erGyldigPeriode = isBefore(fraDato, tilDato);

  return erGyldigPeriode && erPeriodeInnenforDatoBegrensning(periode, datobegrensning);
};

export const hentStartOgSluttDato = (
  periode: IPeriode
): {
  startDato: Date | undefined;
  sluttDato: Date | undefined;
} => {
  const startDato = periode.fra.verdi ? strengTilDato(periode.fra.verdi) : undefined;
  const sluttDato = periode.til.verdi ? strengTilDato(periode.til.verdi) : undefined;

  return { startDato, sluttDato };
};

export const erFraDatoFørTilDato = (
  fraDato: Date | undefined,
  tilDato: Date | undefined
): boolean => {
  if (!fraDato || !tilDato) return false;
  return isBefore(fraDato, tilDato);
};

export const erDatoerLike = (dato1: Date | undefined, dato2: Date | undefined): boolean => {
  if (!dato1 || !dato2) return false;
  return isEqual(dato1, dato2);
};
