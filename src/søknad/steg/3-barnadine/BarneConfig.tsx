import { ESvar, ESvarTekstid, ISpørsmål } from '../../../models/spørsmålogsvar';
import { EBarn } from '../../../models/barn';
import { JaNeiSvar, NeiSvar } from '../../../helpers/svar';
import {
  BarnDokumentasjon,
  IDokumentasjon,
} from '../../../models/dokumentasjon';

// --- Dokumentasjon
const Terminbekreftelse: IDokumentasjon = {
  id: BarnDokumentasjon.TERMINBEKREFTELSE,
  spørsmålid: EBarn.født,
  svarid: ESvar.JA,
  tittel: 'dokumentasjon.terminbekreftelse.tittel',
  beskrivelse: 'dokumentasjon.terminbekreftelse.beskrivelse',
  harSendtInn: false,
};

// --- Spørsmål

export const barnetFødt: ISpørsmål = {
  søknadid: EBarn.født,
  tekstid: 'barnekort.spm.født',
  flersvar: false,
  svaralternativer: [
    {
      id: ESvar.JA,
      svar_tekstid: ESvarTekstid.JA,
      dokumentasjonsbehov: Terminbekreftelse,
    },
    NeiSvar,
  ],
};

export const skalBarnetBoHosSøker: ISpørsmål = {
  søknadid: EBarn.skalBarnetBoHosSøker,
  tekstid: 'barnekort.spm.skalBarnetBoHosSøker',
  flersvar: false,
  svaralternativer: JaNeiSvar,
};

export const borBarnetHosDeg: ISpørsmål = {
  søknadid: EBarn.skalBarnetBoHosSøker,
  tekstid: 'barnekort.spm.skalBarnetBoHosSøker',
  flersvar: false,
  svaralternativer: JaNeiSvar,
};
