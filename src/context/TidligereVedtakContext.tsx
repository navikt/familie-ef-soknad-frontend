import { createContext, useContext, useState } from 'react';

interface TidligereVedtakContextType {
  harLøpendeBarnetilsynVedRegelendring2026: boolean;
  settHarLøpendeBarnetilsynVedRegelendring2026: (harLøpende: boolean) => void;
}

const TidligereVedtakContext = createContext<TidligereVedtakContextType | undefined>(undefined);

const TidligereVedtakProvider = ({ children }: { children: React.ReactNode }) => {
  const [harLøpendeBarnetilsynVedRegelendring2026, settHarLøpendeBarnetilsynVedRegelendring2026] =
    useState<boolean>(false);

  return (
    <TidligereVedtakContext.Provider
      value={{
        harLøpendeBarnetilsynVedRegelendring2026: harLøpendeBarnetilsynVedRegelendring2026,
        settHarLøpendeBarnetilsynVedRegelendring2026: settHarLøpendeBarnetilsynVedRegelendring2026,
      }}
    >
      {children}
    </TidligereVedtakContext.Provider>
  );
};

const useTidligereVedtak = (): TidligereVedtakContextType => {
  const context = useContext(TidligereVedtakContext);
  if (!context) {
    throw new Error('useTidligereVedtak må brukes innenfor TidligereVedtakProvider');
  }
  return context;
};

export { TidligereVedtakProvider, useTidligereVedtak };
