import { Språk } from '../models/felles/språk';
import tekster_en from './tekster_en';
import tekster_nn from './tekster_nn';
import tekster_nb from './tekster_nb';
import { LangType, LocaleType } from './typer';

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

export const hentListeMedSpråk = (): Språk[] => [
  { tittel: 'Bokmål', locale: 'nb' },
  { tittel: 'English', locale: 'en' },
  { tittel: 'Nynorsk', locale: 'nn' },
];

export const hentListeMedSpråkUtenNynorsk = (): Språk[] => [
  { tittel: 'Bokmål', locale: 'nb' },
  { tittel: 'English', locale: 'en' },
];

export const hentValgtSpråk = (locale: LocaleType) => {
  let språk: string = '';
  locale === LocaleType.en
    ? (språk = LangType.English)
    : locale === LocaleType.nn
      ? (språk = LangType.Nynorsk)
      : (språk = LangType.Bokmål);
  return språk;
};
