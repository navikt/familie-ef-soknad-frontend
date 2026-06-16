import { createContext, useContext, useState } from 'react';
import { TidligereVedtakStatus } from '../innsending/api';

interface TidligereVedtakContextType {
  harTidligereVedtakStatus: TidligereVedtakStatus;
  settHarTidligereVedtakStatus: (status: TidligereVedtakStatus) => void;
}

const TidligereVedtakContext = createContext<TidligereVedtakContextType | undefined>(undefined);

const TidligereVedtakProvider = ({ children }: { children: React.ReactNode }) => {
  const [harTidligereVedtakStatus, settHarTidligereVedtakStatus] =
    useState<TidligereVedtakStatus>('VET_IKKE');

  return (
    <TidligereVedtakContext.Provider
      value={{
        harTidligereVedtakStatus,
        settHarTidligereVedtakStatus,
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
