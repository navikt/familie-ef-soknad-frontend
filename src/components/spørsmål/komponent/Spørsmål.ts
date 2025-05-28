export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface SpørsmålAlert {
  id: string;
  alertTekstKey: string;
  variant: AlertVariant;
  link?: {
    urlKey: string;
    linkLabelTekstKey: string;
  };
  skalAlltidVises?: boolean;
  visNår?: (input: Record<string, any>) => boolean;
}

export interface Spørsmål {
  id: string;
  spørsmålTekstKey: string;
  lesMerTittelKey?: string;
  lesMerTekstKey?: string;
  alerts?: SpørsmålAlert[];
}
