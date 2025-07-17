import React from 'react';
import { useLokalIntlContext } from '../../../../../../context/LokalIntlContext';
import {
  JaNeiSpørsmålV2,
  useJaNeiBoolean,
} from '../../../../../../components/spørsmål/v2/JaNeiSpørsmålV2';
import { StegSpørsmål, SvarAlternativ } from '../typer/SpørsmålSvarStruktur';
import { Alert, DatePicker, useDatepicker, VStack } from '@navikt/ds-react';
import { hentTekst } from '../../../../../../utils/søknad';

export const SøkerErGiftV2: React.FC = () => {
  const intl = useLokalIntlContext();
  const søkerHarSøktSeperasjon = useJaNeiBoolean();

  const { datepickerProps, inputProps } = useDatepicker({
    toDate: new Date(),
    onDateChange: console.info,
  });

  const søkerHarSøktSeperasjonSpørsmål: StegSpørsmål = {
    id: 'harSøktSeparasjon',
    spørsmålKey: 'sivilstatus.spm.søktSeparasjon',
  };

  const onSøkerHarSøktSeperasjon = (svar: SvarAlternativ) => {
    søkerHarSøktSeperasjon.handleChange(svar);
  };

  const visSøkerHarIkkeRettPåStønadNårGiftAlert = søkerHarSøktSeperasjon.erNei;
  const visDatoForSkilsmisseInput = søkerHarSøktSeperasjon.erJa;
  const visBekreftelsePåSkilsmisseAlert = søkerHarSøktSeperasjon.erJa;

  return (
    <VStack gap={'6'}>
      <JaNeiSpørsmålV2
        spørsmål={søkerHarSøktSeperasjonSpørsmål}
        onChange={onSøkerHarSøktSeperasjon}
      />

      {visSøkerHarIkkeRettPåStønadNårGiftAlert && (
        <Alert variant={'warning'} size={'small'} inline>
          {hentTekst('sivilstatus.alert-advarsel.søktSeparasjon', intl)}
        </Alert>
      )}

      {visDatoForSkilsmisseInput && (
        <DatePicker {...datepickerProps}>
          <DatePicker.Input
            {...inputProps}
            label={hentTekst('sivilstatus.datovelger.søktSeparasjon', intl)}
          />
        </DatePicker>
      )}

      {visBekreftelsePåSkilsmisseAlert && (
        <Alert variant={'info'} size={'small'} inline>
          {hentTekst('sivilstatus.alert-info.søktSeparasjon', intl)}
        </Alert>
      )}
    </VStack>
  );
};
