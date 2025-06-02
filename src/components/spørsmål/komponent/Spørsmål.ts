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

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export enum SpørsmålSvarInputType {
  RADIO = 'RADIO',
  DATE = 'DATE',
  TEXT = 'TEXT',
  COUNTRY = 'COUNTRY',
}

export interface SpørsmålAlternativ {
  value: string;
  labelKey: string;
}

export interface BaseSpørsmål {
  id: string;
  spørsmålTekstKey: string;
  spørsmålSvarInputType: SpørsmålSvarInputType;
  alternativer?: SpørsmålAlternativ[];
  lesMerTittelKey?: string;
  lesMerTekstKey?: string;
  alerts?: SpørsmålAlert[];
}

export interface SpørsmålNode extends BaseSpørsmål {
  next?: Record<string, string> | string;
}
