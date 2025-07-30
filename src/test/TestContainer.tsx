import React, { ReactNode } from 'react';
import ContextProviders from '../context/ContextProviders';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
            <Route path={'*'} element={children} />
          </Routes>
        </Router>
      </ContextProviders>
    </SpråkProvider>
  );
};
