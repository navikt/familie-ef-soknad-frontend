import React, { useState } from 'react';
import {
  Alert,
  BodyLong,
  Box,
  Heading,
  Link,
  Radio,
  RadioGroup,
  ReadMore,
  VStack,
} from '@navikt/ds-react';
import styles from './SingleSelectSpørsmålKomponent.module.css';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { hentTekst, hentTekstMedVariabel } from '../../../../utils/søknad';
import { SingleSelectSpørsmål, SvarAlternativ } from '../Spørsmål';
import clsx from 'clsx';

interface Props {
  singleSelectSpørsmål: SingleSelectSpørsmål;
}

export const SingleSelectSpørsmålKomponent: React.FC<Props> = ({
  singleSelectSpørsmål,
}) => {
  const intl = useLokalIntlContext();
  const [valgtVerdi, settValgVerdi] = useState<string | null>(null);

  const synligeAlerts = singleSelectSpørsmål.alerts?.filter((alert) => {
    if (alert.skalAlltidVises) return true;
    if (alert.visAlertNår) return alert.visAlertNår({ valgtSvar: valgtVerdi });
    return false;
  });

  return (
    <VStack gap="4">
      <Heading size="xsmall" className={styles.heading}>
        {hentTekst(singleSelectSpørsmål.spørsmålTekstKey, intl)}
      </Heading>

      {singleSelectSpørsmål.lesMerTittelKey &&
        singleSelectSpørsmål.lesMerTekstKey && (
          <ReadMore
            header={hentTekst(singleSelectSpørsmål.lesMerTittelKey, intl)}
          >
            {hentTekst(singleSelectSpørsmål.lesMerTekstKey, intl)}
          </ReadMore>
        )}

      <RadioGroup
        legend={hentTekst(singleSelectSpørsmål.spørsmålTekstKey, intl)}
        hideLegend={true}
        value={valgtVerdi}
        onChange={(val) => settValgVerdi(val)}
      >
        <div
          className={clsx({
            [styles.stackHorizontal]:
              singleSelectSpørsmål.svarAlternativLayout === 'horizontal',
            [styles.stackVertical]:
              singleSelectSpørsmål.svarAlternativLayout === 'vertical',
          })}
        >
          {singleSelectSpørsmål.svarAlternativ.map(
            (svarAlternativ: SvarAlternativ) => (
              <Box
                key={svarAlternativ.svarVerdi}
                className={clsx(
                  styles.radioBox,
                  valgtVerdi === svarAlternativ.svarVerdi && styles.selected
                )}
                onClick={() => {}} // TODO: Fiks meg.
              >
                <Radio value={svarAlternativ.svarVerdi}>
                  {hentTekst(svarAlternativ.label, intl)}
                </Radio>
              </Box>
            )
          )}
        </div>
      </RadioGroup>

      {synligeAlerts &&
        synligeAlerts.map((alert) => (
          <Alert key={alert.id} variant={alert.alertVariant}>
            <BodyLong>
              {hentTekst(alert.alertTekstKey, intl)}
              {alert.alertLink && (
                <>
                  {' '}
                  <Link
                    href={hentTekstMedVariabel(alert.alertLink.urlKey, intl)}
                  >
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
