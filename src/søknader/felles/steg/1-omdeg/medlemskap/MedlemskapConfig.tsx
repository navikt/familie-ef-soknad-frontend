import { ISpørsmål } from '../../../../../models/felles/spørsmålogsvar';
import { JaNeiSvar } from '../../../../../helpers/svar';
import { EMedlemskap, ILandMedKode } from '../../../../../models/steg/omDeg/medlemskap';
import { LocaleType, LokalIntlShape } from '../../../../../language/typer';
import { eøsLandKoder, landliste } from '../../../../../utils/land';

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

export const hentLand = (språk: LocaleType): ILandMedKode[] =>
  landliste
    .map((land) => ({
      id: land.alpha3,
      svar_tekst: land[språk],
      erEøsland: eøsLandKoder.includes(land.alpha3),
    }))
    .sort((a, b) => a.svar_tekst.localeCompare(b.svar_tekst));
