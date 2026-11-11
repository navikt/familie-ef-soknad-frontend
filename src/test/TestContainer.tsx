import type React from 'react';
import type { ReactNode } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router';
import ContextProviders from '../context/ContextProviders';
import { SpråkProvider } from '../context/SpråkContext';

interface Props {
    children: ReactNode;
}

export const TestContainer: React.FC<Props> = ({ children }) => {
    return (
        <SpråkProvider>
            <ContextProviders>
                <Router basename={'/'}>
                    <Routes>
                        <Route path={'/barnetilsyn/*'} element={children} />
                        <Route path={'/skolepenger/*'} element={children} />
                        <Route path={'*'} element={children} />
                    </Routes>
                </Router>
            </ContextProviders>
        </SpråkProvider>
    );
};
