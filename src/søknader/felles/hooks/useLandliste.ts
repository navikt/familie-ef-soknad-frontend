import { useEffect, useState } from 'react';
import { useSpråkContext } from '../../../context/SpråkContext';
import { LocaleType } from '../../../language/typer';
import { ILandMedKode } from '../../../models/steg/omDeg/medlemskap';
import { hentLandkoder } from '../../../utils/søknad';

const sesjonsCache = new Map<LocaleType, ILandMedKode[]>();
const påvent = new Map<LocaleType, Promise<ILandMedKode[]>>();

const hentEllerCache = (locale: LocaleType): Promise<ILandMedKode[]> => {
  const cached = sesjonsCache.get(locale);
  if (cached) return Promise.resolve(cached);

  const eksisterende = påvent.get(locale);
  if (eksisterende) return eksisterende;

  const promise = hentLandkoder(locale)
    .then((data) => {
      sesjonsCache.set(locale, data);
      påvent.delete(locale);
      return data;
    })
    .catch((feil) => {
      påvent.delete(locale);
      throw feil;
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
};
