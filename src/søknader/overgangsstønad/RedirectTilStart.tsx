import React from 'react';
import { Navigate } from 'react-router-dom';
import { useOvergangsstønadSøknad } from './OvergangsstønadContext';

interface Props {
  children: React.ReactElement;
}
const RedirectTilStart: React.FC<Props> = ({ children }) => {
  const { søknad } = useOvergangsstønadSøknad();
  return !søknad.harBekreftet ? <Navigate to={'/'} /> : children;
};

export default RedirectTilStart;
