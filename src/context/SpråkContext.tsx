import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';
import { onLanguageSelect } from '@navikt/nav-dekoratoren-moduler';
import { getMessages } from '../language/utils';
import { LocaleType } from '../language/typer';
import { LokalIntlProvider } from './LokalIntlContext';

const SpråkContext = createContext<
  [LocaleType, Dispatch<SetStateAction<LocaleType>>]
>([LocaleType.nb, () => {}]);

const useSpråkContext = () => useContext(SpråkContext);

const useSpråkCookie = (cookieNavn: string, defaultLocale: LocaleType) => {
  const hentCookie = (name: string): string | null => {
    const cookieVerdi = `; ${document.cookie}`;
    const cookieDeler = cookieVerdi.split(`; ${name}=`);
    if (cookieDeler.length === 2)
      return cookieDeler.pop()?.split(';').shift() || null;
    return null;
  };

  const [locale, setLocale] = useState<LocaleType>(defaultLocale);

  useEffect(() => {
    const cookieSpråk = hentCookie(cookieNavn);
    if (cookieSpråk) {
      setLocale(cookieSpråk as LocaleType);
    }
  }, [cookieNavn]);

  return [locale, setLocale] as const;
};

const SpråkProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [locale, setLocale] = useSpråkCookie(
    'decorator-language',
    LocaleType.nb
  );
  const tekster = getMessages(locale);
  SpråkContext.displayName = 'SPRÅK_CONTEXT';

  useEffect(() => {
    onLanguageSelect((language) => {
      setLocale(language.locale as LocaleType);
    });
  }, [setLocale]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <SpråkContext.Provider value={[locale, setLocale]}>
      <LokalIntlProvider tekster={tekster}>{children}</LokalIntlProvider>
    </SpråkContext.Provider>
  );
};

export { useSpråkContext, SpråkProvider };
