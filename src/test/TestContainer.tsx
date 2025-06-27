import React, { ReactNode } from 'react';
import ContextProviders from '../context/ContextProviders';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SpråkProvider } from '../context/SpråkContext';

interface Props {
  path: '*' | '/barnetilsyn/*' | '/skolepenger/*';
  children: ReactNode;
}

export const TestContainer: React.FC<Props> = ({ path, children }) => {
  return (
    <SpråkProvider>
      <ContextProviders>
        <Router basename={'/'}>
          <Routes>
            <Route path={path} element={children} />
          </Routes>
        </Router>
      </ContextProviders>
    </SpråkProvider>
  );
};
