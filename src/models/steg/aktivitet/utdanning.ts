import { IBooleanFelt, ISpørsmålFelt, ITekstFelt } from '../../søknad/søknadsfelter';
import { IPeriode } from '../../felles/periode';

// --- INTERFACES

export interface IUtdanning {
  id: string;
  linjeKursGrad?: ITekstFelt;
  periode?: IPeriode;
}

export interface IUnderUtdanning extends IUtdanning {
  skoleUtdanningssted: ITekstFelt;
  offentligEllerPrivat?: ISpørsmålFelt;
  heltidEllerDeltid?: ISpørsmålFelt;
  arbeidsmengde?: ITekstFelt;
  målMedUtdanning?: ITekstFelt;
  harTattUtdanningEtterGrunnskolen?: IBooleanFelt;
  tidligereUtdanning?: IUtdanning[];
}

// --- ENUMS

export enum EUtdanning {
  linjeKursGrad = 'linjeKursGrad',
  periode = 'periode',
  skoleUtdanningssted = 'skoleUtdanningssted',
  offentligEllerPrivat = 'offentligEllerPrivat',
  heltidEllerDeltid = 'heltidEllerDeltid',
  arbeidsmengde = 'arbeidsmengde',
  målMedUtdanning = 'målMedUtdanning',
  harTattUtdanningEtterGrunnskolen = 'harTattUtdanningEtterGrunnskolen',
  tidligereUtdanning = 'tidligereUtdanning',
  semesteravgift = 'semesteravgift',
  studieavgift = 'studieavgift',
  eksamensgebyr = 'eksamensgebyr',
}

export enum EUtdanningsform {
  privat = 'privat',
  offentlig = 'offentlig',
}

export enum EStudieandel {
  heltid = 'heltid',
  deltid = 'deltid',
}
