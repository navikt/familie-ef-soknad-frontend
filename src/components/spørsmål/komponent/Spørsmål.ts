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

export interface Spørsmål {
  id: string;

  spørsmålTekstKey: string;
  spørsmålSvarInputType?: SpørsmålSvarInputType;

  lesMerTittelKey?: string;
  lesMerTekstKey?: string;

  alerts?: SpørsmålAlert[];
}
