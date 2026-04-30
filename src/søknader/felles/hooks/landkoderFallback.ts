import { LocaleType } from '../../../language/typer';
import { ILandMedKode } from '../../../models/steg/omDeg/medlemskap';
import { ALPHA3_TIL_ALPHA2 } from './alpha3Mapping';

const EOS_LAND: ReadonlySet<string> = new Set([
  'AUT',
  'BEL',
  'BGR',
  'HRV',
  'CYP',
  'CZE',
  'DNK',
  'EST',
  'FIN',
  'FRA',
  'DEU',
  'GRC',
  'HUN',
  'IRL',
  'ISL',
  'ITA',
  'LVA',
  'LIE',
  'LTU',
  'LUX',
  'MLT',
  'NLD',
  'NOR',
  'POL',
  'PRT',
  'ROU',
  'SVK',
  'SVN',
  'ESP',
  'SWE',
]);

export const fallbackLandliste = (locale: LocaleType): ILandMedKode[] => {
  const visning = new Intl.DisplayNames([locale], { type: 'region' });
  const sammenligner = new Intl.Collator(locale).compare;

  return Object.entries(ALPHA3_TIL_ALPHA2)
    .map(([alpha3, alpha2]) => {
      const navn = visning.of(alpha2);
      if (!navn || navn === alpha2) return undefined;
      return { id: alpha3, svar_tekst: navn, erEøsland: EOS_LAND.has(alpha3) };
    })
    .filter((land): land is ILandMedKode => land !== undefined)
    .sort((a, b) => sammenligner(a.svar_tekst, b.svar_tekst));
};
