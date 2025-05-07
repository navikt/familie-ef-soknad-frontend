import { ISpørsmål } from '../../../../models/felles/spørsmålogsvar';
import { JaNeiSvar, JaSvar, NeiSvar } from '../../../../helpers/svar';
import { ESøknad } from '../../../../models/søknad/søknad';
import { LokalIntlShape } from '../../../../language/typer';
import { EAdresseopplysninger } from '../../../../models/steg/adresseopplysninger';
import { DokumentasjonsConfig } from '../../../DokumentasjonsConfig';

export const borDuPåDenneAdressen = (intl: LokalIntlShape): ISpørsmål => ({
  søknadid: ESøknad.søkerBorPåRegistrertAdresse,
  tekstid: 'personopplysninger.spm.riktigAdresse',
  flersvar: false,
  svaralternativer: JaNeiSvar(intl),
});

export const harMeldtAdresseendringSpørsmål = (
  intl: LokalIntlShape
): ISpørsmål => ({
  søknadid: EAdresseopplysninger.harMeldtAdresseendring,
  tekstid: 'personopplysninger.spm.meldtAdresseendring',
  lesmer: undefined,
  flersvar: false,
  svaralternativer: [
    {
      ...JaSvar(intl),
      alert_tekstid: '',
      dokumentasjonsbehov: DokumentasjonsConfig.MeldtAdresseendring,
    },
    NeiSvar(intl),
  ],
});
