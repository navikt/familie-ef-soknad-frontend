import type { IDatoFelt } from '../søknad/søknadsfelter';

export interface IPeriode {
    label: string;
    fra: IDatoFelt;
    til: IDatoFelt;
}

export enum EPeriode {
    label = 'label',
    fra = 'fra',
    til = 'til',
}
