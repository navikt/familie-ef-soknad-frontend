import React, { useEffect } from 'react';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
import { unikeDokumentasjonsbehov } from '../../../../utils/søknad';
import { useLocation } from 'react-router-dom';
import { usePrevious } from '../../../../utils/hooks';
import LastOppVedlegg from '../../../felles/steg/8-dokumentasjon/LastOppVedlegg';
import SendSøknadKnapper from './SendBarnetilsynSøknad';
import { useBarnetilsynSøknad } from '../../BarnetilsynContext';
import { Side, NavigasjonState } from '../../../../components/side/Side';
import { RoutesBarnetilsyn } from '../../routing/routesBarnetilsyn';
import { IVedlegg } from '../../../../models/steg/vedlegg';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { SøknadBarnetilsyn } from '../../models/søknad';
import { IDokumentasjon } from '../../../../models/steg/dokumentasjon';
import { erVedleggstidspunktGyldig } from '../../../../utils/dato';
import * as Sentry from '@sentry/browser';
import { useDebouncedCallback } from 'use-debounce';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { DokumentasjonBeskrivelse } from '../../../felles/steg/8-dokumentasjon/DokumentasjonBeskrivelse';
import { hentTekst } from '../../../../utils/teksthåndtering';

const Dokumentasjon: React.FC = () => {
  const intl = useLokalIntlContext();
  const { søknad, settSøknad, mellomlagreBarnetilsyn } = useBarnetilsynSøknad();
  const location = useLocation();
  const { dokumentasjonsbehov } = søknad;
  const sidetittel: string = hentTekst('dokumentasjon.tittel', intl);
  const forrigeDokumentasjonsbehov = usePrevious(søknad.dokumentasjonsbehov);

  const oppdaterDokumentasjon = (
    dokumentasjonsid: string,
    opplastedeVedlegg: IVedlegg[] | undefined,
    harSendtInnTidligere: boolean
  ) => {
    settSøknad((prevSoknad: SøknadBarnetilsyn) => {
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

  const debounceMellomlagreBarnetilsyn = useDebouncedCallback((pathName) => {
    mellomlagreBarnetilsyn(pathName);
  }, 500);

  useEffect(() => {
    if (forrigeDokumentasjonsbehov !== undefined) {
      debounceMellomlagreBarnetilsyn(location.pathname);
    }
    // eslint-disable-next-line
  }, [søknad.dokumentasjonsbehov]);

  const harDokumentasjonsbehov = søknad.dokumentasjonsbehov.length > 0;
  return (
    <Side
      stønadstype={Stønadstype.barnetilsyn}
      stegtittel={sidetittel}
      navigasjonState={NavigasjonState.skjulKnapper}
      erSpørsmålBesvart={false}
      routesStønad={RoutesBarnetilsyn}
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
