import { IBooleanFelt, IDatoFelt, ITekstFelt } from './søknadsfelter';
import { IPeriode } from './søknad';

export interface ISivilstatus {
  søkerHarSøktSeparasjon?: IBooleanFelt;
  datoSøktSeparasjon?: IDatoFelt;
  søkerGiftIUtlandet?: IBooleanFelt;
  søkerSeparertEllerSkiltIUtlandet?: IBooleanFelt;
  begrunnelseForSøknad?: ITekstFelt;
  datoForSamlivsbrudd?: IDatoFelt;
  datoFlyttetFraHverandre?: IDatoFelt;
  datoEndretSamvær?: IDatoFelt;
  begrunnelseAnnet?: ITekstFelt;
}

export interface IMedlemskap {
  søkerOppholderSegINorge?: IBooleanFelt;
  søkerBosattINorgeSisteTreÅr?: IBooleanFelt;
  perioderBoddIUtlandet?: IUtenlandsopphold[];
  søkerErFlyktning?: IBooleanFelt;
}

export interface IUtenlandsopphold {
  periode: IPeriode;
  ugyldig: boolean;
  begrunnelse: string;
}
