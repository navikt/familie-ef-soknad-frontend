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
  Stack,
  VStack,
} from '@navikt/ds-react';
import { BaseSpørsmål } from './Spørsmål';
import { hentTekst } from '../../../utils/søknad';
import { useLokalIntlContext } from '../../../context/LokalIntlContext';
import styles from './SpørsmålKomponent.module.css';

interface Props {
  spørsmål: BaseSpørsmål;
}

export const SpørsmålKomponent: React.FC<Props> = ({ spørsmål }) => {
  const intl = useLokalIntlContext();
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const synligeAlerts = spørsmål.alerts?.filter((alert) => {
    if (alert.skalAlltidVises) return true;
    if (alert.visAlertNår)
      return alert.visAlertNår({ valgtSvar: selectedValue });
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

      {/*Spørsmål input her, dette vil jeg skal endre seg.*/}
      <RadioGroup
        legend={hentTekst(spørsmål.spørsmålTekstKey, intl)}
        hideLegend
        value={selectedValue ?? ''}
        onChange={(val) => setSelectedValue(val)}
      >
        <Stack gap="6" direction={{ xs: 'column', sm: 'row' }} wrap={false}>
          <Box
            background="bg-default"
            borderColor="border-alt-3"
            paddingInline="4"
            paddingBlock="1"
            borderWidth="1"
            borderRadius="medium"
            flexGrow={'1'}
          >
            <Radio value={'Ja'}>{hentTekst('svar.ja', intl)}</Radio>
          </Box>
          <Box
            background="bg-default"
            borderColor="border-alt-3"
            paddingInline="4"
            paddingBlock="1"
            borderWidth="1"
            borderRadius="medium"
            flexGrow={'1'}
          >
            <Radio value={'Nei'}>{hentTekst('svar.nei', intl)}</Radio>
          </Box>
        </Stack>
      </RadioGroup>

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
