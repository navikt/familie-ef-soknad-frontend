/* eslint-disable react/prop-types */
import React, { createContext, useContext } from 'react';

export interface OversettProps {
  id: string | number;
}
const LokalIntlContext = createContext<{
  formatMessage: (props: OversettProps, parametre?: Record<string, string>) => string;
  messages: Record<string, string>;
}>({
  formatMessage: () => 'oversettelser ikke tilgjengelig',
  messages: {},
});

const useLokalIntlContext = () => useContext(LokalIntlContext);
const LokalIntlProvider: React.FC<{
  tekster: Record<string, string>;
  children?: React.ReactNode;
}> = ({ children, tekster }) => {
  LokalIntlProvider.displayName = 'LOKAL_INTL_PROVIDER';
  const formatMessage = (props: OversettProps, parametre?: Record<string, string>) => {
    const tekst = tekster[props.id];
    if (tekst === undefined || tekst === null) {
      console.warn(`Finner ikke oversettelse for ${props.id}`);
      return props.id as string;
    }
    if (parametre) {
      return Object.entries(parametre).reduce<string>((acc, cur) => {
        return acc.replaceAll('{' + cur[0] + '}', cur[1]);
      }, tekst);
    }
    return tekst;
  };
  return (
    <LokalIntlContext.Provider value={{ formatMessage, messages: tekster }}>
      {children}
    </LokalIntlContext.Provider>
  );
};

export { useLokalIntlContext, LokalIntlProvider };
