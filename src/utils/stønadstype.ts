import { Stønadstype } from '../models/søknad/stønadstyper';

export const hentBannerKey = (stønadstype: Stønadstype): string => {
  switch (stønadstype) {
    case Stønadstype.overgangsstønad:
      return 'banner.tittel.overgangsstønad';
    case Stønadstype.barnetilsyn:
      return 'banner.tittel.barnetilsyn';
    case Stønadstype.skolepenger:
      return 'banner.tittel.skolepenger';
  }
};
