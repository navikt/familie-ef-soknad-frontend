import type { IVedlegg } from './vedlegg';

export interface IDokumentasjon {
    id: string;
    spørsmålid: string;
    svarid: string;
    tittel: string;
    label: string;
    barnepassid?: string;
    barneid?: string;
    beskrivelse?: string;
    harSendtInn: boolean;
    opplastedeVedlegg?: IVedlegg[];
}

export enum OmDegDokumentasjon {
    SAMLIVSBRUDD = 'SAMLIVSBRUDD',
    INNGÅTT_EKTESKAP = 'INNGÅTT_EKTESKAP',
    SEPARASJON_ELLER_SKILSMISSE = 'SEPARASJON_ELLER_SKILSMISSE',
    UFORMELL_SEPARASJON_ELLER_SKILSMISSE = 'UFORMELL_SEPARASJON_ELLER_SKILSMISSE',
}

export enum AdresseopplysningerDokumentasjon {
    MELDT_ADRESSEENDRING = 'MELDT_ADRESSEENDRING',
}

export enum BosituasjonDokumentasjon {
    BOR_PÅ_ULIKE_ADRESSER = 'BOR_PÅ_ULIKE_ADRESSER',
}

export enum BarnDokumentasjon {
    TERMINBEKREFTELSE = 'TERMINBEKREFTELSE',
}
export enum BarnasBostedDokumentasjon {
    BARN_BOR_HOS_SØKER = 'BARN_BOR_HOS_SØKER',
    SAMVÆRSAVTALE = 'SAMVÆRSAVTALE',
}

export enum AktivitetDokumentasjon {
    UTGIFTER_UTDANNING = 'UTGIFTER_UTDANNING',
    UTDANNING = 'UTDANNING',
    LÆRLING = 'LÆRLING',
    FOR_SYK_TIL_Å_JOBBE = 'FOR_SYK_TIL_Å_JOBBE',
    ETABLERER_VIRKSOMHET = 'ETABLERER_VIRKSOMHET',
}

export enum SituasjonDokumentasjon {
    IKKE_VILLIG_TIL_ARBEID = 'IKKE_VILLIG_TIL_ARBEID',
    SYKDOM = 'SYKDOM',
    SYKT_BARN = 'SYKT_BARN',
    BARNEPASS = 'BARNEPASS',
    BARNETILSYN_BEHOV = 'BARNETILSYN_BEHOV',
    ARBEIDSKONTRAKT = 'ARBEIDSKONTRAKT',
    ARBEIDSFORHOLD_OPPSIGELSE = 'ARBEIDSFORHOLD_OPPSIGELSE',
    ARBEIDSFORHOLD_REDUSERT_ARBEIDSTID = 'ARBEIDSFORHOLD_REDUSERT_ARBEIDSTID',
}

export enum BarnetilsynDokumentasjon {
    FAKTURA_BARNEPASSORDNING = 'FAKTURA_BARNEPASSORDNING',
    AVTALE_BARNEPASSER = 'AVTALE_BARNEPASSER',
    ARBEIDSTID = 'ARBEIDSTID',
    ROTERENDE_ARBEIDSTID = 'ROTERENDE_ARBEIDSTID',
    TRENGER_MER_PASS_ENN_JEVNALDREDE = 'TRENGER_MER_PASS_ENN_JEVNALDREDE',
}
