import React from 'react';
import { Navigate } from 'react-router';
import { useBarnetilsynSøknad } from './BarnetilsynContext';

interface Props {
  children: React.ReactElement;
}

const RedirectTilStart: React.FC<Props> = ({ children }) => {
  const { søknad } = useBarnetilsynSøknad();
  return !søknad.harBekreftet ? <Navigate to={'/barnetilsyn'} /> : children;
};

export default RedirectTilStart;
