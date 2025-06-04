export interface BaseSpørsmål {
  id: string;
  spørsmålTekstKey: string;

  lesMerTittelKey?: string;
  lesMerTekstKey?: string;

  alerts?: SpørsmålAlert[];
}

export type SvarAlternativLayout = 'vertical' | 'horizontal';

export interface SingleSelectSpørsmål extends BaseSpørsmål {
  svarAlternativ: SvarAlternativ[];
  svarAlternativLayout: SvarAlternativLayout;
}

export interface SvarAlternativ {
  svarVerdi: string;
  label: string;
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

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';
