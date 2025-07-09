import { IHjelpetekst } from './hjelpetekst';
import { IDokumentasjon } from '../steg/dokumentasjon';

export enum ESvar {
  JA = 'JA',
  NEI = 'NEI',
}

export enum ESvarTekstid {
  JA = 'svar.ja',
  NEI = 'svar.nei',
}

export interface ILabel {
  søknadid: string;
  tekstid: string;
}

export interface ISpørsmål extends ILabel {
  lesmer?: IHjelpetekst;
  flersvar: boolean;
  svaralternativer: ISvar[];
}

export interface ISvar {
  id: string;
  svar_tekst: string;
  alert_tekstid?: string;
  dokumentasjonsbehov?: IDokumentasjon;
}

export interface ITekst {
  id: string;
  label_tekstid: string;
  alert_tekstid?: string;
}

export interface StegSpørsmål {
  id: string;
  spørsmålKey: string;
  svarAlternativer?: SvarAlternativ[];
}

export interface SvarAlternativ {
  id: string;
  labelKey: string;
}
