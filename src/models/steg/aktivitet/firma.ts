import type { IDatoFelt, ITekstFelt } from '../../søknad/søknadsfelter';

export interface IFirma {
    id: string;
    navn?: ITekstFelt;
    organisasjonsnummer?: ITekstFelt;
    etableringsdato?: IDatoFelt;
    arbeidsmengde?: ITekstFelt;
    overskudd?: ITekstFelt;
    arbeidsuke?: ITekstFelt;
}

export enum EFirma {
    navn = 'navn',
    organisasjonsnummer = 'organisasjonsnummer',
    arbeidsmengde = 'arbeidsmengde',
    overskudd = 'overskudd',
}
