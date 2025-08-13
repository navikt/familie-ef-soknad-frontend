import { GyldigeDatoer } from './Datovelger';
import { addMonths, addYears, compareAsc, isEqual, subYears } from 'date-fns';
import { dagensDato, erGyldigDato, strengTilDato } from '../../utils/dato';
import { IPeriode } from '../../models/felles/periode';

// Brukes for å ikke vise nesteknapp vis dato er ugyldig format eller utenfor begrensninger
export const erDatoGyldigOgInnaforBegrensninger = (
  dato: string,
  datobegrensning: GyldigeDatoer
): boolean => {
  return erGyldigDato(dato) && erDatoInnaforBegrensinger(dato, datobegrensning);
};

export const erDatoInnaforBegrensinger = (
  dato: string,
  datobegrensning: GyldigeDatoer
): boolean => {
  switch (datobegrensning) {
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

export const erPeriodeInnaforBegrensninger = (
  periode: IPeriode,
  datobegrensning: GyldigeDatoer
): boolean => {
  const erFraDatoInnafor = erDatoInnaforBegrensinger(periode.fra.verdi, datobegrensning);
  const erTilDatoInnafor = erDatoInnaforBegrensinger(periode.til.verdi, datobegrensning);

  return erFraDatoInnafor && erTilDatoInnafor;
};

export const erPeriodeGyldigOgInnaforBegrensninger = (
  periode: IPeriode,
  datobegrensning: GyldigeDatoer
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
    erPeriodeInnaforBegrensninger(periode, datobegrensning)
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
