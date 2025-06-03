import constate from 'constate';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useBarnetilsynSøknad } from '../../../barnetilsyn/BarnetilsynContext';
import { useOvergangsstønadSøknad } from '../../../overgangsstønad/OvergangsstønadContext';
import { useSkolepengerSøknad } from '../../../skolepenger/SkolepengerContext';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { RoutesBarnetilsyn } from '../../../barnetilsyn/routing/routesBarnetilsyn';
import { RoutesOvergangsstonad } from '../../../overgangsstønad/routing/routesOvergangsstonad';
import { RoutesSkolepenger } from '../../../skolepenger/routing/routes';
import { hentPathBarnetilsynOppsummering } from '../../../barnetilsyn/utils';
import { hentPathOvergangsstønadOppsummering } from '../../../overgangsstønad/utils';
import { hentPathSkolepengerOppsummering } from '../../../skolepenger/utils';

const [OmDegProvider, useOmDeg] = constate(
  ({ stønadstype }: { stønadstype: Stønadstype }) => {
    const barnetilsynKontekst = useBarnetilsynSøknad();
    const overgangsstønadKontekst = useOvergangsstønadSøknad();
    const skolepengerKontekst = useSkolepengerSøknad();
    const location = useLocation();

    const {
      søknad,
      settSøknad,
      mellomlagretSøknad,
      mellomlagreSøknad2,
      routes,
      pathOppsumering,
      settDokumentasjonsbehov,
    } = (() => {
      switch (stønadstype) {
        case Stønadstype.barnetilsyn:
          return {
            søknad: barnetilsynKontekst.søknad,
            settSøknad: barnetilsynKontekst.settSøknad,
            mellomlagretSøknad: barnetilsynKontekst.mellomlagretBarnetilsyn,
            mellomlagreSøknad2: barnetilsynKontekst.mellomlagreBarnetilsyn2,
            routes: RoutesBarnetilsyn,
            pathOppsumering: hentPathBarnetilsynOppsummering,
            settDokumentasjonsbehov:
              barnetilsynKontekst.settDokumentasjonsbehov,
          };
        case Stønadstype.overgangsstønad:
          return {
            søknad: overgangsstønadKontekst.søknad,
            settSøknad: overgangsstønadKontekst.settSøknad,
            mellomlagretSøknad:
              overgangsstønadKontekst.mellomlagretOvergangsstønad,
            mellomlagreSøknad2:
              overgangsstønadKontekst.mellomlagreOvergangsstønad2,
            routes: RoutesOvergangsstonad,
            pathOppsumering: hentPathOvergangsstønadOppsummering,
            settDokumentasjonsbehov:
              overgangsstønadKontekst.settDokumentasjonsbehov,
          };
        case Stønadstype.skolepenger:
          return {
            søknad: skolepengerKontekst.søknad,
            settSøknad: skolepengerKontekst.settSøknad,
            mellomlagretSøknad: skolepengerKontekst.mellomlagretSkolepenger,
            mellomlagreSøknad2: skolepengerKontekst.mellomlagreSkolepenger2,
            routes: RoutesSkolepenger,
            pathOppsumering: hentPathSkolepengerOppsummering,
            settDokumentasjonsbehov:
              skolepengerKontekst.settDokumentasjonsbehov,
          };
        default:
          throw new Error('Ukjent stønadstype i omDegContext');
      }
    })();

    const [medlemskap, settMedlemskap] = useState(søknad.medlemskap);

    useEffect(() => {
      if (mellomlagretSøknad?.søknad.medlemskap) {
        settMedlemskap(mellomlagretSøknad.søknad.medlemskap);
      }
    }, [mellomlagretSøknad]);

    const mellomlagreOmDeg = () => {
      const oppdatertSøknad = { ...søknad, medlemskap: medlemskap };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      settSøknad({ ...søknad, medlemskap: medlemskap });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return mellomlagreSøknad2(location.pathname, oppdatertSøknad);
    };

    return {
      medlemskap,
      settMedlemskap,
      mellomlagreOmDeg,
      stønadstype,
      routes,
      pathOppsumering,
      settDokumentasjonsbehov,
      søknad,
      settSøknad,
    };
  }
);

export { OmDegProvider, useOmDeg };
