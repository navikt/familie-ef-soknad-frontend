import { ISpørsmål, StegSpørsmål } from '../../../../../models/felles/spørsmålogsvar';
import { JaNeiSvar, JaSvar, NeiSvar } from '../../../../../helpers/svar';
import { ESøknad } from '../../../../overgangsstønad/models/søknad';
import { LokalIntlShape } from '../../../../../language/typer';
import { DokumentasjonsConfig } from '../../../DokumentasjonsConfig';
import { EAdresseopplysninger } from '../../../../../models/steg/adresseopplysninger';

export const borDuPåDenneAdressen = (intl: LokalIntlShape): ISpørsmål => ({
  søknadid: ESøknad.søkerBorPåRegistrertAdresse,
  tekstid: 'personopplysninger.spm.riktigAdresse',
  flersvar: false,
  svaralternativer: JaNeiSvar(intl),
});

export const borDuPåDenneAdressenStegSpørsmål = (): StegSpørsmål => ({
  id: ESøknad.søkerBorPåRegistrertAdresse,
  spørsmålKey: 'personopplysninger.spm.riktigAdresse',
});

export const harMeldtAdresseendringSpørsmål = (intl: LokalIntlShape): ISpørsmål => ({
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
