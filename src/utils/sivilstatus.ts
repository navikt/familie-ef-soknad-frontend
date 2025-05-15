import { ESivilstand, ISivilstatus } from '../models/steg/omDeg/sivilstatus';
import { ISpørsmål } from '../models/felles/spørsmålogsvar';
import { LokalIntlShape } from '../language/typer';
import { hentSivilstatus } from '../helpers/steg/omdeg';
import { hentTekst } from './søknad';

export const sivilstandGift = [
  ESivilstand.GIFT,
  ESivilstand.REPA,
  ESivilstand.REGISTRERT_PARTNER,
];

export const sivilstandUgift = [
  ESivilstand.UGIF,
  ESivilstand.UGIFT,
  ESivilstand.UOPPGITT,
];
export const sivilstandEnke = [
  ESivilstand.ENKE,
  ESivilstand.GJPA,
  ESivilstand.ENKE_ELLER_ENKEMANN,
  ESivilstand.GJENLEVENDE_PARTNER,
];
export const sivilstandSeparert = [
  ESivilstand.SEPA,
  ESivilstand.SEPR,
  ESivilstand.SEPARERT,
  ESivilstand.SEPARERT_PARTNER,
];
export const sivilstandSkilt = [
  ESivilstand.SKIL,
  ESivilstand.SKPA,
  ESivilstand.SKILT,
  ESivilstand.SKILT_PARTNER,
];

export const erSøkerGift = (sivilstand?: string) =>
  sivilstandGift.some((s) => s === sivilstand);

export const erSøkerUgift = (sivilstand?: string): boolean => {
  return (
    sivilstandUgift.some((s) => s === sivilstand) ||
    sivilstand === null ||
    sivilstand === 'NULL'
  );
};

export const erSøkerEnke = (sivilstand?: string) =>
  sivilstandEnke.some((s) => s === sivilstand);

export const erSøkerSeparert = (sivilstand?: string) =>
  sivilstandSeparert.some((s) => s === sivilstand);

export const erSøkerSkilt = (sivilstand?: string) =>
  sivilstandSkilt.some((s) => s === sivilstand);

export const erSøkerUGiftSkiltSeparertEllerEnke = (sivilstand?: string) => {
  return (
    erSøkerUgift(sivilstand) ||
    erSøkerSkilt(sivilstand) ||
    erSøkerSeparert(sivilstand) ||
    erSøkerEnke(sivilstand)
  );
};

export const hentValgtSvar = (
  spørsmål: ISpørsmål,
  sivilstatus: ISivilstatus
) => {
  for (const [key, value] of Object.entries(sivilstatus)) {
    if (key === spørsmål.søknadid && value !== undefined && value !== null) {
      return value.verdi;
    }
  }
};

export const utledFormatertSivilstand = (
  sivilstand: string,
  intl: LokalIntlShape
): string => {
  const sivilstatusKode = hentSivilstatus(sivilstand);
  return hentTekst(sivilstatusKode, intl);
};
