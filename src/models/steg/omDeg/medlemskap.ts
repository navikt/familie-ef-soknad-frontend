import type { IPeriode } from '../../felles/periode';
import type { IBooleanFelt, ISpørsmålFelt, ITekstFelt } from '../../søknad/søknadsfelter';

export interface IMedlemskap {
    søkerOppholderSegINorge?: IBooleanFelt;
    oppholdsland?: ISpørsmålFelt;
    søkerBosattINorgeSisteTreÅr?: IBooleanFelt;
    perioderBoddIUtlandet?: IUtenlandsopphold[];
}

export interface IUtenlandsopphold {
    id: string;
    periode: IPeriode;
    land?: ISpørsmålFelt;
    erEøsLand: boolean;
    begrunnelse: ITekstFelt;
    personidentEøsLand?: ITekstFelt;
    kanIkkeOppgiPersonident?: boolean;
    adresseEøsLand?: ITekstFelt;
}

export enum EMedlemskap {
    søkerOppholderSegINorge = 'søkerOppholderSegINorge',
    oppholdsland = 'oppholdsland',
    søkerBosattINorgeSisteTreÅr = 'søkerBosattINorgeSisteTreÅr',
    perioderBoddIUtlandet = 'perioderBoddIUtlandet',
    utenlandsoppholdLand = 'utenlandsoppholdLand',
}

export interface ILandMedKode {
    id: string; // Bruker Alpha3 landkode som id
    svar_tekst: string;
    erEøsland: boolean;
}
