import React from 'react';
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

interface Props {
  spørsmål: BaseSpørsmål;
}

export const SpørsmålKomponent: React.FC<Props> = ({ spørsmål }) => {
  const intl = useLokalIntlContext();

  const synligeAlerts = spørsmål.alerts?.filter((alert) => {
    if (alert.skalAlltidVises) return true;
    if (alert.visAlertNår) return false; // TODO: Denne må fikses.
    return false;
  });

  return (
    <VStack gap="4">
      <Heading size="xsmall">
        {hentTekst(spørsmål.spørsmålTekstKey, intl)}
      </Heading>

      {spørsmål.lesMerTittelKey && spørsmål.lesMerTekstKey && (
        <ReadMore header={hentTekst(spørsmål.lesMerTittelKey, intl)}>
          {hentTekst(spørsmål.lesMerTekstKey, intl)}
        </ReadMore>
      )}

      {/*Spørsmål input her*/}
      <RadioGroup
        legend={hentTekst(spørsmål.spørsmålTekstKey, intl)}
        hideLegend={true}
        // Denne trengs selv om RadioGroup legend er gjemt, slik at tekstlesere fortsatt skjønner kontekst til valgene.
        // Se Aksel -> https://aksel.nav.no/komponenter/core/radio
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
