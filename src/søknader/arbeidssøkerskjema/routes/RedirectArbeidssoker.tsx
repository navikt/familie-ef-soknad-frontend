import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSkjema } from '../SkjemaContext';
import { RoutesArbeidssokerskjema } from './routesArbeidssokerskjema';

interface Props {
  children: React.ReactElement;
}

const RedirectArbeidssoker: React.FC<Props> = ({ children }) => {
  const { skjema } = useSkjema();

  return !skjema.harBekreftet ? (
    <Navigate to={RoutesArbeidssokerskjema[0].path} />
  ) : (
    children
  );
};

export default RedirectArbeidssoker;
