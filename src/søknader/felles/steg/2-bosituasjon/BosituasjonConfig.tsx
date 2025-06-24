import { ISpørsmål } from '../../../../models/felles/spørsmålogsvar';
import {
  EBosituasjon,
  ESøkerDelerBolig,
} from '../../../../models/steg/bosituasjon';
import { JaNeiSvar } from '../../../../helpers/svar';
import { IDokumentasjon } from '../../../../models/steg/dokumentasjon';
import { DokumentasjonsConfig } from '../../DokumentasjonsConfig';
import { LokalIntlShape } from '../../../../language/typer';

// --- Dokumentasjon

const DokumentasjonBorPåUlikeAdresser: IDokumentasjon =
  DokumentasjonsConfig.DokumentasjonBorPåUlikeAdresser;

// --- Spørsmål

export const delerSøkerBoligMedAndreVoksne = (
  intl: LokalIntlShape
): ISpørsmål => ({
  søknadid: EBosituasjon.delerBoligMedAndreVoksne,
  tekstid: 'bosituasjon.spm.delerSøkerBoligMedAndreVoksne',
  flersvar: false,
  svaralternativer: [
    {
      id: ESøkerDelerBolig.borSammenOgVenterBarn,
      svar_tekst: intl.formatMessage({
        id: 'bosituasjon.svar.borSammenOgVenterBarn',
      }),
      alert_tekstid: 'bosituasjon.alert.borSammenOgVenterBarn',
    },
    {
      id: ESøkerDelerBolig.borMidlertidigFraHverandre,
      svar_tekst: intl.formatMessage({
        id: 'bosituasjon.svar.borMidlertidigFraHverandre',
      }),
      alert_tekstid: 'bosituasjon.alert.borMidlertidigFraHverandre',
    },
    {
      id: ESøkerDelerBolig.harEkteskapsliknendeForhold,
      svar_tekst: intl.formatMessage({
        id: 'bosituasjon.svar.harEkteskapsliknendeForhold',
      }),
      alert_tekstid: 'bosituasjon.alert.harEkteskapsliknendeForhold',
    },
    {
      id: ESøkerDelerBolig.delerBoligMedAndreVoksne,
      svar_tekst: intl.formatMessage({
        id: 'bosituasjon.svar.delerBoligMedAndreVoksne',
      }),
    },
    {
      id: ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse,
      svar_tekst: intl.formatMessage({
        id: 'bosituasjon.svar.tidligereSamboerFortsattRegistrertPåAdresse',
      }),
      alert_tekstid:
        'bosituasjon.alert.tidligereSamboerFortsattRegistrertPåAdresse',
      dokumentasjonsbehov: DokumentasjonBorPåUlikeAdresser,
    },
    {
      id: ESøkerDelerBolig.borAleneMedBarnEllerGravid,
      svar_tekst: intl.formatMessage({
        id: 'bosituasjon.svar.borAleneMedBarnEllerGravid',
      }),
    },
  ],
});

export const skalSøkerGifteSegMedSamboer = (
  intl: LokalIntlShape
): ISpørsmål => ({
  søknadid: EBosituasjon.skalGifteSegEllerBliSamboer,
  tekstid: 'bosituasjon.spm.skalSøkerGifteSegMedSamboer',
  flersvar: false,
  svaralternativer: JaNeiSvar(intl),
});
