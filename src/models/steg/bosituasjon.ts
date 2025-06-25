import { IDatoFelt, ISpørsmålBooleanFelt, ISpørsmålFelt } from '../søknad/søknadsfelter';
import { IPersonDetaljer } from '../søknad/person';

export interface IBosituasjon {
  delerBoligMedAndreVoksne: ISpørsmålFelt;
  skalGifteSegEllerBliSamboer?: ISpørsmålBooleanFelt;
  datoFlyttetSammenMedSamboer?: IDatoFelt;
  datoSkalGifteSegEllerBliSamboer?: IDatoFelt;
  datoFlyttetFraHverandre?: IDatoFelt;
  samboerDetaljer?: IPersonDetaljer;
  vordendeSamboerEktefelle?: IPersonDetaljer;
}

export enum EBosituasjon {
  delerBoligMedAndreVoksne = 'delerBoligMedAndreVoksne',
  skalGifteSegEllerBliSamboer = 'skalGifteSegEllerBliSamboer',
  datoFlyttetSammenMedSamboer = 'datoFlyttetSammenMedSamboer',
  datoFlyttetFraHverandre = 'datoFlyttetFraHverandre',
  datoSkalGifteSegEllerBliSamboer = 'datoSkalGifteSegEllerBliSamboer',
  samboerDetaljer = 'samboerDetaljer',
  vordendeSamboerEktefelle = 'vordendeSamboerEktefelle',
}

export enum ESøkerDelerBolig {
  borAleneMedBarnEllerGravid = 'borAleneMedBarnEllerGravid',
  borMidlertidigFraHverandre = 'borMidlertidigFraHverandre',
  borSammenOgVenterBarn = 'borSammenOgVenterBarn',
  harEkteskapsliknendeForhold = 'harEkteskapsliknendeForhold',
  delerBoligMedAndreVoksne = 'delerBoligMedAndreVoksne',
  tidligereSamboerFortsattRegistrertPåAdresse = 'tidligereSamboerFortsattRegistrertPåAdresse',
}
