import { BaseSpørsmål } from './Spørsmål';
import React from 'react';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import {
  Alert,
  BodyLong,
  Heading,
  Link,
  ReadMore,
  VStack,
} from '@navikt/ds-react';
import styles from './SpørsmålWrapper.module.css';
import { hentTekst, hentTekstMedVariabel } from '../../../../utils/søknad';

export const SpørsmålWrapper: React.FC<{
  spørsmål: BaseSpørsmål;
  valgtSvar?: string | null;
  children: React.ReactNode;
}> = ({ spørsmål, valgtSvar = null, children }) => {
  const intl = useLokalIntlContext();

  const synligeAlerts = spørsmål.alerts?.filter((alert) => {
    if (alert.skalAlltidVises) return true;
    if (alert.visAlertNår) return alert.visAlertNår({ valgtSvar });
    return false;
  });

  return (
    <VStack gap="4">
      <Heading size="xsmall" className={styles.heading}>
        {hentTekst(spørsmål.spørsmålTekstKey, intl)}
      </Heading>

      {spørsmål.lesMerTittelKey && spørsmål.lesMerTekstKey && (
        <ReadMore header={hentTekst(spørsmål.lesMerTittelKey, intl)}>
          {hentTekst(spørsmål.lesMerTekstKey, intl)}
        </ReadMore>
      )}

      {children}

      {synligeAlerts?.map((alert) => (
        <Alert key={alert.id} variant={alert.alertVariant}>
          <BodyLong>
            {hentTekst(alert.alertTekstKey, intl)}
            {alert.alertLink && (
              <>
                {' '}
                <Link href={hentTekstMedVariabel(alert.alertLink.urlKey, intl)}>
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
