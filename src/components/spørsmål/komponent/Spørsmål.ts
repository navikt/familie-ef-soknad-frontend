export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export enum SpørsmålSvarInputType {
  RADIO = 'RADIO',
  FLERVALG = 'FLERVALG',
  DATO = 'DATO',
  DATO_PERIODE = 'DATO_PERIODE',
  TEKST = 'TEKST',
  INGEN_INPUT = 'INGEN_INPUT',
}

export interface SpørsmålAlert {
  id: string;
  alertTekstKey: string;
  alertVariant: AlertVariant;
  alertLink?: {
    urlKey: string;
    linkLabelTekstKey: string;
  };
  skalAlltidVises?: boolean;
  visAlertNår?: (input: Record<string, any>) => boolean;
}

export type RadioSvarVerdi = string;
export type FlerValgSvarVerdi = string[];
export type EnkeltDatoSvarVerdi = { type: 'enkel'; dato: Date | undefined };
export type PeriodeSvarVerdi = {
  type: 'periode';
  fra: Date | undefined;
  til: Date | undefined;
};
export type TekstSvarVerdi = string;
export type IngenInputSvarVerdi = undefined;

export type SvarVerdi =
  | RadioSvarVerdi
  | FlerValgSvarVerdi
  | EnkeltDatoSvarVerdi
  | PeriodeSvarVerdi
  | TekstSvarVerdi
  | IngenInputSvarVerdi;

export interface BaseSpørsmål {
  id: string;
  spørsmålTekstKey: string;
  spørsmålSvarInputType: SpørsmålSvarInputType;
  lesMerTittelKey?: string;
  lesMerTekstKey?: string;
  alerts?: SpørsmålAlert[];
}

export interface RadioSpørsmål extends BaseSpørsmål {
  spørsmålSvarInputType: SpørsmålSvarInputType.RADIO;
  svarAlternativer: string[];
  svarAlternativRetning?: 'horizontal' | 'vertical';
}

export interface FlerValgSpørsmål extends BaseSpørsmål {
  spørsmålSvarInputType: SpørsmålSvarInputType.FLERVALG;
  svarAlternativer: string[];
}

export interface DatoSpørsmål extends BaseSpørsmål {
  spørsmålSvarInputType: SpørsmålSvarInputType.DATO;
  tillaterDatoTilbakeITid?: boolean;
}

export interface DatoPeriodeSpørsmål extends BaseSpørsmål {
  spørsmålSvarInputType: SpørsmålSvarInputType.DATO_PERIODE;
  tillaterDatoTilbakeITid?: boolean;
}

export interface TekstSpørsmål extends BaseSpørsmål {
  spørsmålSvarInputType: SpørsmålSvarInputType.TEKST;
  maxLengde?: number;
  placeholderKey?: string;
}

export interface IngenInputSpørsmål extends BaseSpørsmål {
  spørsmålSvarInputType: SpørsmålSvarInputType.INGEN_INPUT;
}

export type Spørsmål =
  | RadioSpørsmål
  | FlerValgSpørsmål
  | DatoSpørsmål
  | DatoPeriodeSpørsmål
  | TekstSpørsmål
  | IngenInputSpørsmål;
