import { createContext, useContext, useState } from 'react';
import { TidligereVedtakStatus } from '../innsending/api';

interface TidligereVedtakContextType {
  tidligereVedtakStatus: TidligereVedtakStatus | null;
  settTidligereVedtakStatus: (status: TidligereVedtakStatus | null) => void;
}

const TidligereVedtakContext = createContext<TidligereVedtakContextType | undefined>(undefined);

const TidligereVedtakProvider = ({ children }: { children: React.ReactNode }) => {
  const [tidligereVedtakStatus, settTidligereVedtakStatus] = useState<TidligereVedtakStatus | null>(
    null
  );

  return (
    <TidligereVedtakContext.Provider value={{ tidligereVedtakStatus, settTidligereVedtakStatus }}>
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
