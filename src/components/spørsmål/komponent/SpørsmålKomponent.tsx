import React from 'react';
import { Spørsmål } from './Spørsmål';
import {
  Alert,
  BodyLong,
  Heading,
  Link,
  ReadMore,
  VStack,
} from '@navikt/ds-react';
import { useLokalIntlContext } from '../../../context/LokalIntlContext';
import { hentTekst } from '../../../utils/søknad';

interface Props {
  spørsmål: Spørsmål;
  svarInput: Record<string, any>;
}

export const SpørsmålKomponent: React.FC<Props> = ({ spørsmål, svarInput }) => {
  const intl = useLokalIntlContext();

  const { spørsmålTekstKey, lesMerTittelKey, lesMerTekstKey, alerts } =
    spørsmål;

  const synligeAlerts = alerts?.filter((alert) => {
    if (alert.skalAlltidVises) return true;
    if (alert.visAlertNår) return alert.visAlertNår(svarInput);
    return false;
  });

  return (
    <VStack gap="4">
      <Heading size="small">{hentTekst(spørsmålTekstKey, intl)}</Heading>

      {lesMerTittelKey && lesMerTekstKey && (
        <ReadMore header={hentTekst(lesMerTittelKey, intl)}>
          {hentTekst(lesMerTekstKey, intl)}
        </ReadMore>
      )}

      {/* Forskjellig typer input implementeres her, kommer siden. */}

      {synligeAlerts &&
        synligeAlerts.map((alert) => (
          <Alert key={alert.id} variant={alert.alertVariant}>
            <BodyLong>
              {hentTekst(alert.alertTekstKey, intl)}
              {alert.alertLink && (
                <>
                  {' '}
                  <Link href={hentTekst(alert.alertLink.urlKey, intl)}>
                    {hentTekst(alert.alertLink.linkLabelTekstKey, intl)}
                  </Link>
                </>
              )}
            </BodyLong>
          </Alert>
        ))}
    </VStack>
  );
};
