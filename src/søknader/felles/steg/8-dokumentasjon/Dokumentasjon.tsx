import React, { useEffect } from 'react';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
import { unikeDokumentasjonsbehov } from '../../../../utils/søknad';
import { usePrevious } from '../../../../utils/hooks';
import LastOppVedlegg from '../../../felles/steg/8-dokumentasjon/LastOppVedlegg';
import { NavigasjonState, Side } from '../../../../components/side/Side';
import { IDokumentasjon } from '../../../../models/steg/dokumentasjon';
import { erVedleggstidspunktGyldig } from '../../../../utils/dato';
import * as Sentry from '@sentry/browser';
import { useDebouncedCallback } from 'use-debounce';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { DokumentasjonBeskrivelse } from './DokumentasjonBeskrivelse';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { IVedlegg } from '../../../../models/steg/vedlegg';
import { useDokumentasjon } from './DokumentasjonsContext';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { SendSøknadKnapper as SendSøknadKnapperOvergangsstønad } from '../../../overgangsstønad/steg/8-dokumentasjon/SendSøknad';
import { SendSøknadKnapper as SendSøknadKnapperBarnetilsyn } from '../../../barnetilsyn/steg/8-dokumentasjon/SendBarnetilsynSøknad';
import { SendSøknadKnapper as SendSøknadKnapperSkolepenger } from '../../../skolepenger/steg/7-dokumentasjon/SendSkolepengerSøknad';

const Dokumentasjon: React.FC = () => {
  const intl = useLokalIntlContext();
  const { stønadstype, mellomlagreSteg, routes, dokumentasjonsbehov, settDokumentasjonsbehov } =
    useDokumentasjon();
  const forrigeDokumentasjonsbehov = usePrevious(dokumentasjonsbehov);

  const oppdaterDokumentasjon = (
    dokumentasjonsid: string,
    opplastedeVedlegg: IVedlegg[] | undefined,
    harSendtInnTidligere: boolean
  ) => {
    const dokumentasjonMedVedlegg = dokumentasjonsbehov.map((dok) => {
      return dok.id === dokumentasjonsid
        ? { ...dok, opplastedeVedlegg: opplastedeVedlegg, harSendtInn: harSendtInnTidligere }
        : dok;
    });

    settDokumentasjonsbehov(dokumentasjonMedVedlegg);
  };

  // Fjern vedlegg som evt. har blitt slettet i familie-dokument
  useEffect(() => {
    dokumentasjonsbehov.forEach((dokBehov: IDokumentasjon) => {
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

  const debounceMellomlagre = useDebouncedCallback(() => {
    mellomlagreSteg();
  }, 500);

  useEffect(() => {
    if (forrigeDokumentasjonsbehov !== undefined) {
      debounceMellomlagre();
    }
    // eslint-disable-next-line
  }, [dokumentasjonsbehov]);

  const harDokumentasjonsbehov = dokumentasjonsbehov.length > 0;
  return (
    <Side
      stønadstype={stønadstype}
      stegtittel={hentTekst('dokumentasjon.tittel', intl)}
      navigasjonState={NavigasjonState.skjulKnapper}
      erSpørsmålBesvart={false}
      routesStønad={routes}
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
      {stønadstype === Stønadstype.overgangsstønad && <SendSøknadKnapperOvergangsstønad />}
      {stønadstype === Stønadstype.barnetilsyn && <SendSøknadKnapperBarnetilsyn />}
      {stønadstype === Stønadstype.skolepenger && <SendSøknadKnapperSkolepenger />}
    </Side>
  );
};

export default Dokumentasjon;
