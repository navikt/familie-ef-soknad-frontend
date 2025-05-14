import {
  IDatoFelt,
  ISpørsmålBooleanFelt,
  ISpørsmålFelt,
} from '../søknad/søknadsfelter';
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

export enum DelerBoligMedAndreVoksne {
  IKKEBESVART = 'ikkeBesvart',
  BORSAMMENOGHARELLERVENTERBARN = 'borSammenOgHarEllerVenterBarn',
  BORMIDLERTIDIGFRAHVERANDRE = 'borMidlertidigFraHverandre',
  BORMEDKJÆRESTE = 'borMedKjæreste',
  DELERBOLIGMEDANDREVOKSNE = 'delerBoligMedAndreVoksne',
  TIDLIGERESAMBOERFORTSATTREGISTRERTPÅADRESSE = 'tidligereSamboerFortsattRegistrertPåAdresse',
  BORALENEMEDBARNELLERGRAVIDOGBORALENE = 'borAleneMedBarnEllerGravidOgBorAlene',
}

export type Bo3 =
  | {
      hovedSpørsmål: DelerBoligMedAndreVoksne.IKKEBESVART;
    }
  | {
      hovedSpørsmål: DelerBoligMedAndreVoksne.BORSAMMENOGHARELLERVENTERBARN;
    }
  | {
      hovedSpørsmål: DelerBoligMedAndreVoksne.BORMIDLERTIDIGFRAHVERANDRE;
    }
  | {
      hovedSpørsmål: DelerBoligMedAndreVoksne.BORMEDKJÆRESTE;
      samboerNavn: string;
      samboerIdent?: string;
      kjennerIkkeIdent: boolean;
      samboerFødselsdato?: string;
      datoFlyttetSammenMedSamboer: string;
    }
  | {
      hovedSpørsmål: DelerBoligMedAndreVoksne.DELERBOLIGMEDANDREVOKSNE;
      skalGifteSegEllerBliSamboer: boolean;
      datoSkalGifteSegEllerBliSamboer?: string;
      samboerNavn: string;
      samboerIdent?: string;
      kjennerIkkeIdent: boolean;
      samboerFødselsdato?: string;
    }
  | {
      hovedSpørsmål: DelerBoligMedAndreVoksne.TIDLIGERESAMBOERFORTSATTREGISTRERTPÅADRESSE;
      samboerNavn: string;
      samboerIdent?: string;
      kjennerIkkeIdent: boolean;
      samboerFødselsdato?: string;
      datoFlyttetFraHverandre: string;
    }
  | {
      hovedSpørsmål: DelerBoligMedAndreVoksne.BORALENEMEDBARNELLERGRAVIDOGBORALENE;
      skalGifteSegEllerBliSamboer: boolean;
      datoSkalGifteSegEllerBliSamboer?: string;
      samboerNavn: string;
      samboerIdent?: string;
      kjennerIkkeIdent: boolean;
      samboerFødselsdato?: string;
    };

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
