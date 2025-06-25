export function harVerdi<T>(verdi: T | null | undefined): verdi is T {
  return verdi !== null && verdi !== undefined;
}

export function stringHarVerdiOgErIkkeTom<T>(verdi: T | null | undefined): verdi is T {
  return harVerdi(verdi) && verdi !== '';
}

export function stringErNullEllerTom(verdi: string | null | undefined): boolean {
  return verdi === null || verdi === undefined || verdi === '';
}
