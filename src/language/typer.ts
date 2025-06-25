import { OversettProps } from '../context/LokalIntlContext';

export enum LocaleType {
  en = 'en',
  nb = 'nb',
  nn = 'nn',
}

export enum LangType {
  English = 'English',
  Bokmål = 'Bokmål',
  Nynorsk = 'Nynorsk',
}

export interface LokalIntlShape {
  formatMessage: (props: OversettProps, parametre?: Record<string, string>) => string;
  messages: Record<string, string>;
}
