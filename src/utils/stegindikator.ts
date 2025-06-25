import { IRoute } from '../models/routes';

const routesSomIkkeSkalMed = ['Gjenbruk', 'Kvittering'];

export const stegSomSkalVisesPåStegindikator = (routes: IRoute[]) => {
  const routesFiltered = routes.filter((route) => !routesSomIkkeSkalMed.includes(route.label));

  return routesFiltered.map((steg, index) => {
    return {
      ...steg,
      index: index,
    };
  });
};
