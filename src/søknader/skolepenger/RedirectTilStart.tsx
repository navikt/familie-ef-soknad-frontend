import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSkolepengerSøknad } from './SkolepengerContext';

interface Props {
  children: React.ReactElement;
}
const RedirectTilStart: React.FC<Props> = ({ children }) => {
  const { søknad } = useSkolepengerSøknad();
  return !søknad.harBekreftet ? <Navigate to={'/skolepenger'} /> : children;
};

export default RedirectTilStart;
