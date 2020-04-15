import { IVedlegg } from './vedlegg';

export interface IDokumentasjon {
  id: string;
  spørsmålid: string;
  svarid: string;
  tittel: string;
  beskrivelse: string;
  harSendtInn: boolean;
  opplastedeVedlegg?: IVedlegg[];
}

export enum EDokumentasjon {
  INNGÅTT_EKTESKAP = 'INNGÅTT_EKTESKAP',
  SEPARASJON_ELLER_SKILSMISSE = 'SEPARASJON_ELLER_SKILSMISSE',
}

export enum SituasjonDokumentasjon {
  SYKDOM = 'SYKDOM',
  SYKT_BARN = 'SYKT_BARN',
  BARNEPASS = 'BARNEPASS',
  BARNETILSYN_BEHOV = 'BARNETILSYN_BEHOV',
  ARBEIDSKONTRAKT = 'ARBEIDSKONTRAKT',
  UTDANNING = 'UTDANNING',
  ARBEIDSFORHOLD_OPPSIGELSE = 'ARBEIDSFORHOLD_OPPSIGELSE',
  ARBEIDSFORHOLD_REDUSERT_ARBEIDSTID = 'ARBEIDSFORHOLD_REDUSERT_ARBEIDSTID',
}
