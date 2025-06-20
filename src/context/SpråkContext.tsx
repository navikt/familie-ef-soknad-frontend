import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { onLanguageSelect } from '@navikt/nav-dekoratoren-moduler';
import { getMessages } from '../language/utils';
import { LocaleType } from '../language/typer';
import { LokalIntlProvider } from './LokalIntlContext';

const SpråkContext = createContext<[LocaleType, Dispatch<SetStateAction<LocaleType>>]>([
  LocaleType.nb,
  () => {},
]);

const useSpråkContext = () => useContext(SpråkContext);

const SpråkProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const defaultSpråk = LocaleType.nb;
  const [locale, setLocale] = useState(defaultSpråk);
  const tekster = getMessages(locale);

  SpråkContext.displayName = 'SPRÅK_CONTEXT';

  onLanguageSelect((language) => {
    setLocale(language.locale as LocaleType);
  });

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
