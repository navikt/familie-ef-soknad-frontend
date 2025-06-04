export interface BaseSpørsmål {
  id: string;
  spørsmålTekstKey: string;

  lesMerTittelKey?: string;
  lesMerTekstKey?: string;

  alerts?: SpørsmålAlert[];

  oppfølgningsSpørsmål?: OppfølgningsSpørsmål[];
}

export type SvarAlternativLayout = 'vertical' | 'horizontal';

export interface SingleSelectSpørsmål extends BaseSpørsmål {
  type: 'single-select';
  svarAlternativ: SvarAlternativ[];
  svarAlternativLayout: SvarAlternativLayout;
}

export type Spørsmål = SingleSelectSpørsmål;

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

export interface OppfølgningsSpørsmål {
  visNår: (valgtSvar: string | null) => boolean;
  spørsmål: Spørsmål;
}
