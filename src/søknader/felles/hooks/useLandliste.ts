import { useEffect, useState } from 'react';
import * as Sentry from '@sentry/browser';
import { useSpråkContext } from '../../../context/SpråkContext';
import { LocaleType } from '../../../language/typer';
import { ILandMedKode } from '../../../models/steg/omDeg/medlemskap';
import { hentLandkoder } from '../../../utils/søknad';
import { fallbackLandliste } from './landkoderFallback';

const landlisteCache = new Map<LocaleType, ILandMedKode[]>();
const inflightRequests = new Map<LocaleType, Promise<ILandMedKode[]>>();
const sentryReported = new Set<LocaleType>();

const reportFallback = (locale: LocaleType, årsak: string, feil?: unknown) => {
  if (sentryReported.has(locale)) return;
  sentryReported.add(locale);
  Sentry.captureMessage(
    `Bruker statisk landliste fallback med årsak: ${årsak} for språk: ${locale}`,
    {
      level: 'warning',
      extra: { feil: feil instanceof Error ? feil.message : String(feil ?? '') },
    }
  );
};

const hentEllerCache = (locale: LocaleType): Promise<ILandMedKode[]> => {
  const cached = landlisteCache.get(locale);
  if (cached) return Promise.resolve(cached);

  const pågåendeKall = inflightRequests.get(locale);
  if (pågåendeKall) return pågåendeKall;

  const promise = hentLandkoder(locale)
    .then((data) => {
      if (data.length === 0) {
        reportFallback(locale, 'tom liste fra api');
        const fallback = fallbackLandliste(locale);

        landlisteCache.set(locale, fallback);
        inflightRequests.delete(locale);

        return fallback;
      }

      landlisteCache.set(locale, data);
      inflightRequests.delete(locale);

      return data;
    })
    .catch((feil) => {
      reportFallback(locale, 'api kall feilet', feil);

      const fallback = fallbackLandliste(locale);
      landlisteCache.set(locale, fallback);
      inflightRequests.delete(locale);

      return fallback;
    });
  inflightRequests.set(locale, promise);
  return promise;
};

export interface UseLandlisteResultat {
  land: ILandMedKode[];
  isLoading: boolean;
  error: Error | undefined;
}

export const useLandliste = (): UseLandlisteResultat => {
  const [locale] = useSpråkContext();
  const [land, settLand] = useState<ILandMedKode[]>(() => landlisteCache.get(locale) ?? []);
  const [isLoading, settIsLoading] = useState<boolean>(() => !landlisteCache.has(locale));
  const [error, settError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    let venterPåSvar = true;
    settError(undefined);

    const cached = landlisteCache.get(locale);
    if (cached) {
      settLand(cached);
      settIsLoading(false);
      return;
    }

    settIsLoading(true);
    hentEllerCache(locale)
      .then((data) => {
        if (!venterPåSvar) return;
        settLand(data);
        settIsLoading(false);
      })
      .catch((feil: Error) => {
        if (!venterPåSvar) return;
        settError(feil);
        settIsLoading(false);
      });

    return () => {
      venterPåSvar = false;
    };
  }, [locale]);

  return { land, isLoading, error };
};

export const _resetLandlisteCacheForTest = () => {
  landlisteCache.clear();
  inflightRequests.clear();
  sentryReported.clear();
};
