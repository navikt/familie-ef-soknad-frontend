import {
  dagensIsoDatoMinusMåneder,
  dagensIsoDatoPlussMåneder,
  formatIsoToStandardFormat,
} from '../utils/dato';

export const dagensDato = formatIsoToStandardFormat(dagensIsoDatoPlussMåneder(0));
export const datoEnMånedFrem = formatIsoToStandardFormat(dagensIsoDatoPlussMåneder(1));
export const datoEnMånedTilbake = formatIsoToStandardFormat(dagensIsoDatoMinusMåneder(1));

export const isoDatoEnMånedFrem = dagensIsoDatoPlussMåneder(1);
export const isoDatoEnMånedTilbake = dagensIsoDatoMinusMåneder(1);
