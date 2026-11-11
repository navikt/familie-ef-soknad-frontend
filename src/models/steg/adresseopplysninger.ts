import type { ISpørsmålBooleanFelt } from '../søknad/søknadsfelter';

export interface IAdresseopplysninger {
    harMeldtAdresseendring?: ISpørsmålBooleanFelt;
}

export enum EAdresseopplysninger {
    harMeldtAdresseendring = 'harMeldtAdresseendring',
}
