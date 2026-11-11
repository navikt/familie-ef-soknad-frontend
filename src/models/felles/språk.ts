export interface LocaleString {
    [key: string]: string | undefined;
    nb?: string;
    en?: string;
    nn?: string;
}

export interface Språk {
    tittel: string;
    locale: string;
}
