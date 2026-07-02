import { logAnalyticsEvent, logAnalyticsCustomEvent } from '@navikt/nav-dekoratoren-moduler';
import { Events } from '@navikt/nav-dekoratoren-moduler';

const ORIGIN = 'familie-ef-soknad';

export const loggKnappKlikket = (
  tekst: string,
  kontekst?: string,
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger'
) => {
  logAnalyticsEvent({
    origin: ORIGIN,
    eventName: Events.KNAPP_KLIKKET,
    eventData: { tekst, kontekst, variant },
  });
};

export const loggLesMerÅpnet = (tittel: string, kontekst?: string) => {
  logAnalyticsEvent({
    origin: ORIGIN,
    eventName: Events.LES_MER_APNET,
    eventData: { tittel, kontekst },
  });
};

export const loggLesMerLukket = (tittel: string, kontekst?: string) => {
  logAnalyticsEvent({
    origin: ORIGIN,
    eventName: Events.LES_MER_LUKKET,
    eventData: { tittel, kontekst },
  });
};

export const loggCustomEvent = (eventName: string, eventData?: Record<string, unknown>) => {
  logAnalyticsCustomEvent({
    origin: ORIGIN,
    eventName,
    eventData,
  });
};
