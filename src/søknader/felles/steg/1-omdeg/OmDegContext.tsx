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
import { validerOmDeg } from './OmDegValidering';

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
    const [sivilstatus, settSivilstatus] = useState(søknad.sivilstatus);
    const [søkerBorPåRegistrertAdresse, settSøkerBorPåRegistrertAdresse] =
      useState(søknad.søkerBorPåRegistrertAdresse);
    const [harMeldtAdresseendring, settHarMeldtAdresseendring] = useState(
      søknad.adresseopplysninger?.harMeldtAdresseendring
    );

    useEffect(() => {
      if (mellomlagretSøknad?.søknad.medlemskap) {
        settMedlemskap(mellomlagretSøknad.søknad.medlemskap);
      }
      if (mellomlagretSøknad?.søknad.sivilstatus) {
        settSivilstatus(mellomlagretSøknad.søknad.sivilstatus);
      }
      if (mellomlagretSøknad?.søknad.søkerBorPåRegistrertAdresse) {
        settSøkerBorPåRegistrertAdresse(
          mellomlagretSøknad.søknad.søkerBorPåRegistrertAdresse
        );
      }
      if (
        mellomlagretSøknad?.søknad.adresseopplysninger?.harMeldtAdresseendring
      ) {
        settHarMeldtAdresseendring(
          mellomlagretSøknad.søknad.adresseopplysninger.harMeldtAdresseendring
        );
      }
    }, [mellomlagretSøknad]);

    const mellomlagreOmDeg = () => {
      const oppdatertSøknad = validerOmDeg(søknad, sivilstatus, medlemskap);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      settSøknad(oppdatertSøknad);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return mellomlagreSøknad2(location.pathname, oppdatertSøknad);
    };

    return {
      søkerBorPåRegistrertAdresse,
      settSøkerBorPåRegistrertAdresse,
      harMeldtAdresseendring,
      settHarMeldtAdresseendring,
      sivilstatus,
      settSivilstatus,
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
