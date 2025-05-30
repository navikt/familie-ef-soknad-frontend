import {
  ISpørsmålFelt,
  ITekstFelt,
} from '../../../models/søknad/søknadsfelter';
import { IPeriode } from '../../../models/felles/periode';

export interface IBarnepass {
  årsakBarnepass?: ISpørsmålFelt;
  barnepassordninger: IBarnepassOrdning[];
}

export interface IBarnepassOrdning {
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
}
