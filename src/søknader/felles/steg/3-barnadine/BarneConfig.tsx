import { JaNeiSvar, JaSvar, NeiSvar } from '../../../../helpers/svar';
import type { LokalIntlShape } from '../../../../language/typer';
import type { ISpørsmål } from '../../../../models/felles/spørsmålogsvar';
import { EBarn } from '../../../../models/steg/barn';
import type { IDokumentasjon } from '../../../../models/steg/dokumentasjon';
import { DokumentasjonsConfig } from '../../DokumentasjonsConfig';

// --- Dokumentasjon
const Terminbekreftelse: IDokumentasjon = DokumentasjonsConfig.Terminbekreftelse;

// --- Spørsmål

export const barnetFødt = (intl: LokalIntlShape): ISpørsmål => ({
    søknadid: EBarn.født,
    tekstid: 'barnekort.spm.født',
    flersvar: false,
    svaralternativer: [JaSvar(intl), { ...NeiSvar(intl), dokumentasjonsbehov: Terminbekreftelse }],
});

export const skalBarnetBoHosSøker = (intl: LokalIntlShape): ISpørsmål => ({
    søknadid: EBarn.skalBarnetBoHosSøker,
    tekstid: 'barnekort.spm.skalBarnetBoHosSøker',
    flersvar: false,
    svaralternativer: JaNeiSvar(intl),
});
