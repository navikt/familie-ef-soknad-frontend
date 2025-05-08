import { ISpørsmål } from '../../../../models/felles/spørsmålogsvar';
import { JaNeiSvar } from '../../../../helpers/svar';
import {
  EMedlemskap,
  ILandMedKode,
} from '../../../../models/steg/omDeg/medlemskap';
import { LocaleType, LokalIntlShape } from '../../../../language/typer';
import CountryData, { Countries, CountryFilter } from '@navikt/land-verktoy';

export const oppholderSegINorge = (intl: LokalIntlShape): ISpørsmål => ({
  søknadid: EMedlemskap.søkerOppholderSegINorge,
  tekstid: 'medlemskap.spm.opphold',
  flersvar: false,

  svaralternativer: JaNeiSvar(intl),
});

export const søkersOppholdsland = (land: ILandMedKode[]): ISpørsmål => ({
  søknadid: EMedlemskap.oppholdsland,
  tekstid: 'medlemskap.spm.oppholdsland',
  flersvar: false,
  svaralternativer: land,
});

export const bosattINorgeDeSisteFemÅr = (intl: LokalIntlShape): ISpørsmål => ({
  søknadid: EMedlemskap.søkerBosattINorgeSisteTreÅr,
  tekstid: 'medlemskap.spm.bosatt',
  flersvar: false,

  svaralternativer: JaNeiSvar(intl),
});

export const utenlandsoppholdLand = (land: ILandMedKode[]): ISpørsmål => ({
  søknadid: EMedlemskap.utenlandsoppholdLand,
  tekstid: 'medlemskap.periodeBoddIUtlandet.land',
  flersvar: false,
  svaralternativer: land,
});

export const hentLand = (språk: LocaleType): ILandMedKode[] => {
  const landFilter = CountryFilter.STANDARD({});
  const filtrertLandliste: Countries =
    CountryData.getCountryInstance(språk).filterByValueOnArray(landFilter);
  const eøsLand = hentEØSLand(språk);
  return filtrertLandliste
    .map((land: { alpha3: string; label: string }) => {
      return {
        id: land.alpha3,
        svar_tekst: land.label,
        erEøsland: eøsLand.some((eøs) => eøs.alpha3 === land.alpha3),
      };
    })
    .sort((a, b) => a.svar_tekst.localeCompare(b.svar_tekst));
};

export const hentEØSLand = (språk: LocaleType): Countries => {
  const landFilter = CountryFilter.EEA({});
  return CountryData.getCountryInstance(språk).filterByValueOnArray(landFilter);
};
