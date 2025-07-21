import React, { useEffect } from 'react';
import { useLokalIntlContext } from '../../../../../../context/LokalIntlContext';
import {
  JaNeiSpørsmålV2,
  useJaNeiBoolean,
} from '../../../../../../components/spørsmål/v2/JaNeiSpørsmålV2';
import { StegSpørsmål, SvarAlternativ } from '../typer/SpørsmålSvarStruktur';
import { Alert, DatePicker, useDatepicker, VStack } from '@navikt/ds-react';
import { hentTekst } from '../../../../../../utils/søknad';
import { useOmDegV2 } from '../typer/OmDegContextV2';

export const SøkerErGiftV2: React.FC = () => {
  const intl = useLokalIntlContext();
  const { oppdaterSivilstatus } = useOmDegV2();

  const søkerHarSøktSeperasjon = useJaNeiBoolean();

  const { datepickerProps, inputProps } = useDatepicker({
    toDate: new Date(),
    onDateChange: (dato: Date | undefined) => {
      oppdaterSivilstatus({
        separasjonsDato: dato,
      });
    },
  });

  const søkerHarSøktSeperasjonSpørsmål: StegSpørsmål = {
    id: 'harSøktSeparasjon',
    spørsmålKey: 'sivilstatus.spm.søktSeparasjon',
  };

  // Oppdater context når verdier endres
  useEffect(() => {
    oppdaterSivilstatus({
      søkerHarSøktSeperasjon: søkerHarSøktSeperasjon.value,
    });
  }, [søkerHarSøktSeperasjon.value, oppdaterSivilstatus]);

  const onSøkerHarSøktSeperasjon = (svar: SvarAlternativ) => {
    søkerHarSøktSeperasjon.handleChange(svar);

    if (svar.id === 'NEI') {
      // Nullstill dato hvis svaret er nei
      oppdaterSivilstatus({
        separasjonsDato: undefined,
      });
    }
  };

  const visSøkerHarIkkeRettPåStønadNårGiftAlert = søkerHarSøktSeperasjon.erNei;
  const visDatoForSkilsmisseInput = søkerHarSøktSeperasjon.erJa;

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
        <VStack gap={'6'}>
          <DatePicker {...datepickerProps}>
            <DatePicker.Input
              {...inputProps}
              label={hentTekst('sivilstatus.datovelger.søktSeparasjon', intl)}
              placeholder="DD.MM.YYYY"
            />
          </DatePicker>

          <Alert variant={'info'} size={'small'} inline>
            {hentTekst('sivilstatus.alert-info.søktSeparasjon', intl)}
          </Alert>
        </VStack>
      )}
    </VStack>
  );
};
