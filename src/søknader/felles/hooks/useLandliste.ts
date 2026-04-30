import { useEffect, useState } from 'react';
import * as Sentry from '@sentry/browser';
import { useSpråkContext } from '../../../context/SpråkContext';
import { LocaleType } from '../../../language/typer';
import { ILandMedKode } from '../../../models/steg/omDeg/medlemskap';
import { hentLandkoder } from '../../../utils/søknad';
import { fallbackLandliste } from './landkoderFallback';

const sesjonsCache = new Map<LocaleType, ILandMedKode[]>();
const påvent = new Map<LocaleType, Promise<ILandMedKode[]>>();
const sentryRapportert = new Set<LocaleType>();

const rapporterFallback = (locale: LocaleType, årsak: string, feil?: unknown) => {
  if (sentryRapportert.has(locale)) return;
  sentryRapportert.add(locale);
  Sentry.captureMessage(`Bruker statisk landliste fallback (${årsak}) for språk=${locale}`, {
    level: 'warning',
    extra: { feil: feil instanceof Error ? feil.message : String(feil ?? '') },
  });
};

const hentEllerCache = (locale: LocaleType): Promise<ILandMedKode[]> => {
  const cached = sesjonsCache.get(locale);
  if (cached) return Promise.resolve(cached);

  const eksisterende = påvent.get(locale);
  if (eksisterende) return eksisterende;

  const promise = hentLandkoder(locale)
    .then((data) => {
      if (data.length === 0) {
        rapporterFallback(locale, 'tom liste fra api');
        const fallback = fallbackLandliste(locale);
        sesjonsCache.set(locale, fallback);
        påvent.delete(locale);
        return fallback;
      }
      sesjonsCache.set(locale, data);
      påvent.delete(locale);
      return data;
    })
    .catch((feil) => {
      rapporterFallback(locale, 'api kall feilet', feil);
      const fallback = fallbackLandliste(locale);
      sesjonsCache.set(locale, fallback);
      påvent.delete(locale);
      return fallback;
    });
  påvent.set(locale, promise);
  return promise;
};

export interface UseLandlisteResultat {
  land: ILandMedKode[];
  isLoading: boolean;
  error: Error | undefined;
}

export const useLandliste = (): UseLandlisteResultat => {
  const [locale] = useSpråkContext();
  const [land, settLand] = useState<ILandMedKode[]>(() => sesjonsCache.get(locale) ?? []);
  const [isLoading, settIsLoading] = useState<boolean>(() => !sesjonsCache.has(locale));
  const [error, settError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    let aktiv = true;
    settError(undefined);

    const cached = sesjonsCache.get(locale);
    if (cached) {
      settLand(cached);
      settIsLoading(false);
      return;
    }

    settIsLoading(true);
    hentEllerCache(locale)
      .then((data) => {
        if (!aktiv) return;
        settLand(data);
        settIsLoading(false);
      })
      .catch((feil: Error) => {
        if (!aktiv) return;
        settError(feil);
        settIsLoading(false);
      });

    return () => {
      aktiv = false;
    };
  }, [locale]);

  return { land, isLoading, error };
};

export const _resetLandlisteCacheForTest = () => {
  sesjonsCache.clear();
  påvent.clear();
  sentryRapportert.clear();
};
