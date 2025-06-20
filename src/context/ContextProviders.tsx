import React from 'react';
import { PersonProvider } from './PersonContext';
import { OvergangsstønadSøknadProvider } from '../søknader/overgangsstønad/OvergangsstønadContext';
import { TogglesProvider } from './TogglesContext';
import { BarnetilsynSøknadProvider } from '../søknader/barnetilsyn/BarnetilsynContext';
import { SkolepengerSøknadProvider } from '../søknader/skolepenger/SkolepengerContext';
import { GjenbrukProvider } from './GjenbrukContext';

const ContextProviders: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  ContextProviders.displayName = 'CONTEXT_PROVIDERS';
  return (
    <TogglesProvider>
      <GjenbrukProvider>
        <PersonProvider>
          <OvergangsstønadSøknadProvider>
            <BarnetilsynSøknadProvider>
              <SkolepengerSøknadProvider>{children}</SkolepengerSøknadProvider>
            </BarnetilsynSøknadProvider>
          </OvergangsstønadSøknadProvider>
        </PersonProvider>
      </GjenbrukProvider>
    </TogglesProvider>
  );
};

export default ContextProviders;
