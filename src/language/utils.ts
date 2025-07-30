import tekster_en from './tekster_en';
import tekster_nn from './tekster_nn';
import tekster_nb from './tekster_nb';
import { LocaleType } from './typer';

export const getMessages = (locale: LocaleType) => {
  if (locale === LocaleType.en) {
    return tekster_en;
  } else if (locale === LocaleType.nn) {
    return tekster_nn;
  } else {
    return tekster_nb;
  }
};

export const hentTittelMedNr = (liste: any[], oppholdsnr: number, tittel: string) => {
  const tall = liste.length >= 2 ? oppholdsnr + 1 : '';

  return tittel + ' ' + tall;
};
