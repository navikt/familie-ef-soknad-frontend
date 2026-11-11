import type React from 'react';
import { BarnetilsynSøknadProvider } from '../søknader/barnetilsyn/BarnetilsynContext';
import { OvergangsstønadSøknadProvider } from '../søknader/overgangsstønad/OvergangsstønadContext';
import { SkolepengerSøknadProvider } from '../søknader/skolepenger/SkolepengerContext';
import { GjenbrukProvider } from './GjenbrukContext';
import { PersonProvider } from './PersonContext';
import { TidligereVedtakProvider } from './TidligereVedtakContext';
import { TogglesProvider } from './TogglesContext';

const ContextProviders: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    ContextProviders.displayName = 'CONTEXT_PROVIDERS';
    return (
        <TogglesProvider>
            <TidligereVedtakProvider>
                <GjenbrukProvider>
                    <PersonProvider>
                        <OvergangsstønadSøknadProvider>
                            <BarnetilsynSøknadProvider>
                                <SkolepengerSøknadProvider>{children}</SkolepengerSøknadProvider>
                            </BarnetilsynSøknadProvider>
                        </OvergangsstønadSøknadProvider>
                    </PersonProvider>
                </GjenbrukProvider>
            </TidligereVedtakProvider>
        </TogglesProvider>
    );
};

export default ContextProviders;
