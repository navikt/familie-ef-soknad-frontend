import { useMemo } from 'react';
import { useToggles } from '../../../context/TogglesContext';
import { ToggleName } from '../../../models/søknad/toggles';
import { filtrerRoutesUtenGjenbruk, RoutesBarnetilsyn } from './routesBarnetilsyn';

export const useBarnetilsynRoutes = () => {
  const { toggles } = useToggles();
  const gjenbrukBarnetilsynToggle = toggles[ToggleName.gjenbrukBarnetilsyn];

  const routes = useMemo(() => {
    return gjenbrukBarnetilsynToggle
      ? RoutesBarnetilsyn
      : filtrerRoutesUtenGjenbruk(RoutesBarnetilsyn);
  }, [gjenbrukBarnetilsynToggle]);

  return { routes, gjenbrukAktivert: gjenbrukBarnetilsynToggle };
};
