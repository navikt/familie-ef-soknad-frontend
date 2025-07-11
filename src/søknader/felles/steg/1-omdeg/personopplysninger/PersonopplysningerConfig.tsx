import { StegSpørsmål } from '../../../../../models/felles/spørsmålogsvar';
import { ESøknad } from '../../../../overgangsstønad/models/søknad';
import { EAdresseopplysninger } from '../../../../../models/steg/adresseopplysninger';

export const borDuPåDenneAdressenStegSpørsmål = (): StegSpørsmål => ({
  id: ESøknad.søkerBorPåRegistrertAdresse,
  spørsmålKey: 'personopplysninger.spm.riktigAdresse',
});

export const harMeldtAdresseendringStegSpørsmål = (): StegSpørsmål => ({
  id: EAdresseopplysninger.harMeldtAdresseendring,
  spørsmålKey: 'personopplysninger.spm.meldtAdresseendring',
});
