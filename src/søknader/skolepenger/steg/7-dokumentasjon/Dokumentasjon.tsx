import React, { useEffect } from 'react';
import LastOppVedlegg from '../../../felles/steg/8-dokumentasjon/LastOppVedlegg';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
import { unikeDokumentasjonsbehov } from '../../../../utils/søknad';
import SendSøknadKnapper from './SendSkolepengerSøknad';
import { useLocation } from 'react-router-dom';
import { useMount, usePrevious } from '../../../../utils/hooks';
import { erVedleggstidspunktGyldig } from '../../../../utils/dato';
import * as Sentry from '@sentry/browser';
import { Side, NavigasjonState } from '../../../../components/side/Side';
import { RoutesSkolepenger } from '../../routing/routes';
import { IVedlegg } from '../../../../models/steg/vedlegg';
import { useSkolepengerSøknad } from '../../SkolepengerContext';

import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { logSidevisningSkolepenger } from '../../../../utils/amplitude';
import { SøknadSkolepenger } from '../../models/søknad';
import { IDokumentasjon } from '../../../../models/steg/dokumentasjon';
import { useDebouncedCallback } from 'use-debounce';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { DokumentasjonBeskrivelse } from '../../../felles/steg/8-dokumentasjon/DokumentasjonBeskrivelse';
import { hentTekst } from '../../../../utils/teksthåndtering';

const Dokumentasjon: React.FC = () => {
  const intl = useLokalIntlContext();
  const { søknad, settSøknad, mellomlagreSkolepenger } = useSkolepengerSøknad();
  const location = useLocation();
  const { dokumentasjonsbehov } = søknad;
  const sidetittel: string = hentTekst('dokumentasjon.tittel', intl);
  const forrigeDokumentasjonsbehov = usePrevious(søknad.dokumentasjonsbehov);

  useMount(() => logSidevisningSkolepenger('Dokumentasjon'));

  const oppdaterDokumentasjon = (
    dokumentasjonsid: string,
    opplastedeVedlegg: IVedlegg[] | undefined,
    harSendtInnTidligere: boolean
  ) => {
    settSøknad((prevSoknad: SøknadSkolepenger) => {
      const dokumentasjonMedVedlegg = prevSoknad.dokumentasjonsbehov.map((dok) => {
        return dok.id === dokumentasjonsid
          ? {
              ...dok,
              opplastedeVedlegg: opplastedeVedlegg,
              harSendtInn: harSendtInnTidligere,
            }
          : dok;
      });
      return { ...prevSoknad, dokumentasjonsbehov: dokumentasjonMedVedlegg };
    });
  };

  const debounceMellomlagreSkolepenger = useDebouncedCallback((pathName) => {
    mellomlagreSkolepenger(pathName);
  }, 500);

  useEffect(() => {
    if (forrigeDokumentasjonsbehov !== undefined) {
      debounceMellomlagreSkolepenger(location.pathname);
    }
    // eslint-disable-next-line
  }, [søknad.dokumentasjonsbehov]);

  // Fjern vedlegg som evt. har blitt slettet i familie-dokument
  useEffect(() => {
    søknad.dokumentasjonsbehov.forEach((dokBehov: IDokumentasjon) => {
      if (dokBehov.opplastedeVedlegg) {
        const gyldigeVedlegg = dokBehov.opplastedeVedlegg.filter((vedlegg) =>
          erVedleggstidspunktGyldig(vedlegg.tidspunkt)
        );
        if (gyldigeVedlegg.length !== dokBehov.opplastedeVedlegg.length) {
          Sentry.captureEvent({
            message: `Fjernet ugyldig vedlegg fra søknaden.`,
            level: 'warning',
          });
          oppdaterDokumentasjon(dokBehov.id, gyldigeVedlegg, dokBehov.harSendtInn);
        }
      }
    });
    // eslint-disable-next-line
  }, []);

  const harDokumentasjonsbehov = søknad.dokumentasjonsbehov.length > 0;
  return (
    <Side
      stønadstype={Stønadstype.skolepenger}
      stegtittel={sidetittel}
      navigasjonState={NavigasjonState.skjulKnapper}
      erSpørsmålBesvart={false}
      mellomlagreStønad={mellomlagreSkolepenger}
      routesStønad={RoutesSkolepenger}
    >
      <DokumentasjonBeskrivelse harDokumentasjonsbehov={harDokumentasjonsbehov} />
      <SeksjonGruppe>
        {dokumentasjonsbehov
          .filter(unikeDokumentasjonsbehov)
          .map((dokumentasjon: IDokumentasjon, i: number) => {
            return (
              <LastOppVedlegg
                key={i}
                dokumentasjon={dokumentasjon}
                oppdaterDokumentasjon={oppdaterDokumentasjon}
              />
            );
          })}
      </SeksjonGruppe>

      <SendSøknadKnapper />
    </Side>
  );
};

export default Dokumentasjon;
