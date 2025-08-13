import { GyldigeDatoer } from '../components/dato/Datovelger';
import { addMonths, addYears, compareAsc, isEqual, subYears } from 'date-fns';
import { dagensDato, erGyldigDato, strengTilDato } from './dato';
import { IPeriode } from '../models/felles/periode';

// Brukes for å ikke vise nesteknapp vis dato er ugyldig format eller utenfor begrensninger
export const erDatoGyldigOgInnenforBegrensning = (
  dato: string,
  gyldigeDatoer: GyldigeDatoer
): boolean => {
  return erGyldigDato(dato) && erDatoInnenforBegrensing(dato, gyldigeDatoer);
};

export const erDatoInnenforBegrensing = (dato: string, gyldigeDatoer: GyldigeDatoer): boolean => {
  switch (gyldigeDatoer) {
    case GyldigeDatoer.alle:
      return dato !== '';

    case GyldigeDatoer.fremtidige:
      return (
        dato !== '' &&
        strengTilDato(dato) <= addYears(dagensDato, 100) &&
        strengTilDato(dato) >= dagensDato
      );

    case GyldigeDatoer.tidligere:
      return (
        dato !== '' &&
        strengTilDato(dato) >= subYears(dagensDato, 100) &&
        strengTilDato(dato) <= dagensDato
      );

    case GyldigeDatoer.tidligereOgSeksMånederFrem:
      return (
        dato !== '' &&
        strengTilDato(dato) >= subYears(dagensDato, 100) &&
        strengTilDato(dato) <= addMonths(dagensDato, 6)
      );

    case GyldigeDatoer.femÅrTidligereOgSeksMånederFrem:
      return (
        dato !== '' &&
        strengTilDato(dato) >= subYears(dagensDato, 5) &&
        strengTilDato(dato) <= addMonths(dagensDato, 6)
      );

    case GyldigeDatoer.femtiÅrTidligereOgSeksMånederFrem:
      return (
        dato !== '' &&
        strengTilDato(dato) >= subYears(dagensDato, 50) &&
        strengTilDato(dato) <= addMonths(dagensDato, 6)
      );
  }
};

export const erPeriodeInnenforBegrensning = (
  periode: IPeriode,
  gyldigeDatoer: GyldigeDatoer
): boolean => {
  const erFraDatoInnenfor = erDatoInnenforBegrensing(periode.fra.verdi, gyldigeDatoer);
  const erTilDatoInnenfor = erDatoInnenforBegrensing(periode.til.verdi, gyldigeDatoer);

  return erFraDatoInnenfor && erTilDatoInnenfor;
};

export const erPeriodeGyldigOgInnenforforBegrensning = (
  periode: IPeriode,
  gyldigeDatoer: GyldigeDatoer
): boolean => {
  const { fra, til } = periode;

  if (!(erGyldigDato(fra.verdi) && erGyldigDato(til.verdi))) {
    return false;
  }

  const fom: Date | undefined = periode.fra.verdi !== '' ? strengTilDato(fra.verdi) : undefined;
  const tom: Date | undefined = periode.til.verdi !== '' ? strengTilDato(til.verdi) : undefined;

  const erFraDatoSenereEnnTilDato: boolean = fom && tom ? compareAsc(fom, tom) === -1 : true;
  const erDatoerLike = fom && tom ? isEqual(fom, tom) : false;

  return (
    erFraDatoSenereEnnTilDato &&
    !erDatoerLike &&
    erPeriodeInnenforBegrensning(periode, gyldigeDatoer)
  );
};

export const hentStartOgSluttDato = (
  periode: IPeriode
): {
  startDato: Date | undefined;
  sluttDato: Date | undefined;
} => {
  const { til, fra } = periode;
  const sluttDato: Date | undefined = til.verdi !== '' ? strengTilDato(til.verdi) : undefined;
  const startDato: Date | undefined = fra.verdi !== '' ? strengTilDato(fra.verdi) : undefined;
  return { startDato, sluttDato };
};

export const erFraDatoSenereEnnTilDato = (
  startDato: Date | undefined,
  sluttDato: Date | undefined
): boolean | undefined => startDato && sluttDato && compareAsc(startDato, sluttDato) === -1;

export const erDatoerLike = (
  startDato: Date | undefined,
  sluttDato: Date | undefined
): boolean | undefined => startDato && sluttDato && isEqual(startDato, sluttDato);
