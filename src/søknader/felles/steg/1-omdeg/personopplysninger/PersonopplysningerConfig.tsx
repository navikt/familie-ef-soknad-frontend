import { JaNeiSvar, JaSvar, NeiSvar } from '../../../../../helpers/svar';
import type { LokalIntlShape } from '../../../../../language/typer';
import type { ISpørsmål } from '../../../../../models/felles/spørsmålogsvar';
import { EAdresseopplysninger } from '../../../../../models/steg/adresseopplysninger';
import { ESøknad } from '../../../../overgangsstønad/models/søknad';
import { DokumentasjonsConfig } from '../../../DokumentasjonsConfig';

export const borDuPåDenneAdressen = (intl: LokalIntlShape): ISpørsmål => ({
    søknadid: ESøknad.søkerBorPåRegistrertAdresse,
    tekstid: 'personopplysninger.spm.riktigAdresse',
    flersvar: false,
    svaralternativer: JaNeiSvar(intl),
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
