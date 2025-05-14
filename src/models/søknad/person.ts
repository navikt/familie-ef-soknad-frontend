import { IBarn } from '../steg/barn';
import { IDatoFelt, ITekstFelt } from './søknadsfelter';

export interface IPerson {
  hash: string;
  søker: ISøker;
  barn: IBarn[];
}

export interface IPersonTilGjenbruk {
  barn: IBarn[];
}

export interface ISøker {
  fnr: string;
  alder: number;
  forkortetNavn: string;
  adresse: Adresse;
  sivilstand: string;
  statsborgerskap: string;
  erStrengtFortrolig: boolean;
}

export interface Adresse {
  adresse: string;
  postnummer: string;
  poststed?: string;
}

export interface IPersonDetaljer {
  navn?: ITekstFelt;
  ident?: ITekstFelt;
  fødselsdato?: IDatoFelt;
  kjennerIkkeIdent: boolean;
}

export enum EPersonDetaljer {
  navn = 'navn',
  ident = 'ident',
  fødselsdato = 'fødselsdato',
  kjennerIkkeIdent = 'kjennerIkkeIdent',
}

type Medforelder = {
  harAdressesperre: boolean;
  død: boolean;
  ident: string;
  navn: string;
  alder: number;
};

export type Barn = {
  alder: number;
  fnr: string;
  fødselsdato: string;
  harAdressesperre: boolean;
  harSammeAdresse: boolean;
  medforelder?: Medforelder;
  navn: string;
};

export type PersonData = {
  søker: ISøker;
  barn: Barn[];
  hash: string;
};
