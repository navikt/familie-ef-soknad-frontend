import type { IPeriode } from '../../../models/felles/periode';
import type { ISpørsmålFelt, ITekstFelt } from '../../../models/søknad/søknadsfelter';

export interface IBarnepass {
    årsakBarnepass?: ISpørsmålFelt;
    barnepassordninger: BarnepassOrdning[];
}

export interface BarnepassOrdning {
    id: string;
    hvaSlagsBarnepassOrdning?: ISpørsmålFelt;
    navn?: ITekstFelt;
    periode?: IPeriode;
    belop?: ITekstFelt;
}

export enum EBarnepass {
    årsakBarnepass = 'årsakBarnepass',
    hvaSlagsBarnepassOrdning = 'hvaSlagsBarnepassOrdning',
    navn = 'navn',
    periode = 'periode',
    belop = 'belop',
    søkerFraBestemtMåned = 'søkerFraBestemtMåned',
}

export enum ETypeBarnepassOrdning {
    barnehageOgLiknende = 'barnehageOgLiknende',
    privat = 'privat',
}

export enum EÅrsakBarnepass {
    trengerMerPassEnnJevnaldrede = 'trengerMerPassEnnJevnaldrede',
    myeBortePgaJobb = 'myeBortePgaJobb',
    utenomVanligArbeidstid = 'utenomVanligArbeidstid',
    ingenAlternativPasserMeg = 'ingenAlternativPasserMeg',
}
