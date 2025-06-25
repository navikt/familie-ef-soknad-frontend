import React, { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react';

export const GjenbrukContext = createContext<{
  skalGjenbrukeSøknad: boolean;
  settSkalGjenbrukeSøknad: Dispatch<SetStateAction<boolean>>;
}>({
  skalGjenbrukeSøknad: false,
  settSkalGjenbrukeSøknad: () => {},
});

export const GjenbrukProvider = ({ children }: { children: ReactNode }) => {
  const [skalGjenbrukeSøknad, settSkalGjenbrukeSøknad] = useState<boolean>(false);

  return (
    <GjenbrukContext.Provider
      value={{
        skalGjenbrukeSøknad,
        settSkalGjenbrukeSøknad,
      }}
    >
      {children}
    </GjenbrukContext.Provider>
  );
};
