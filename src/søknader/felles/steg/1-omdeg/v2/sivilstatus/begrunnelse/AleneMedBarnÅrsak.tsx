import React, { useState } from 'react';
import { StegSpørsmål, SvarAlternativ } from '../../typer/SpørsmålSvarStruktur';
import { SpørsmålWrapper } from '../../../../../../../components/spørsmål/v2/SpørsmålWrapper';
import { Alert, DatePicker, useDatepicker, VStack } from '@navikt/ds-react';
import { RadioSpørsmål } from '../../../../../../../components/spørsmål/v2/RadioSpørsmål';
import { hentTekst } from '../../../../../../../utils/søknad';
import { useLokalIntlContext } from '../../../../../../../context/LokalIntlContext';

export const AleneMedBarnÅrsak: React.FC = () => {
  const intl = useLokalIntlContext();

  const [søkerAleneMedBarnÅrsak, settSøkerAleneMedBarnÅrsak] = useState<
    SvarAlternativ | undefined
  >();
  const [samlivsbruddDato, settSamlivsbruddDato] = useState<Date | undefined>();

  const { datepickerProps, inputProps } = useDatepicker({
    toDate: new Date(),
    onDateChange: (dato: Date | undefined) => {
      settSamlivsbruddDato(dato);
    },
  });

  const hvorforErDuAleneMedBarnSpørsmål: StegSpørsmål = {
    id: 'årsakEnslig',
    spørsmålKey: 'sivilstatus.spm.begrunnelse',
  };

  const hvorforAlenedMedBarnSvarAlternativer: SvarAlternativ[] = [
    { id: 'samlivsbruddForeldre', svarKey: 'sivilstatus.svar.samlivsbruddForeldre' },
    { id: 'samlivsbruddAndre', svarKey: 'sivilstatus.svar.samlivsbruddAndre' },
    { id: 'endringISamværsordning', svarKey: 'sivilstatus.svar.endringISamværsordning' },
    { id: 'aleneFraFødsel', svarKey: 'sivilstatus.svar.aleneFraFødsel' },
    { id: 'dødsfall', svarKey: 'sivilstatus.svar.dødsfall' },
  ];

  const onÅrsakSøkerErAleneMedBarn = (svar: SvarAlternativ) => {
    settSøkerAleneMedBarnÅrsak(svar);
  };

  const visDatoForSamvlivsbruddInput = søkerAleneMedBarnÅrsak?.id === 'samlivsbruddForeldre';

  return (
    <VStack gap={'6'}>
      <VStack gap={'6'}>
        <SpørsmålWrapper
          spørsmål={hvorforErDuAleneMedBarnSpørsmål}
          lesMerTittel={hentTekst('sivilstatus.hjelpetekst-åpne.begrunnelse', intl)}
          lesMerTekst={hentTekst('sivilstatus.hjelpetekst-innhold.begrunnelse', intl)}
        />

        <RadioSpørsmål
          spørsmål={hvorforErDuAleneMedBarnSpørsmål}
          svarAlternativer={hvorforAlenedMedBarnSvarAlternativer}
          valgtVerdi={undefined}
          svarLayout={'vertical'}
          onChange={onÅrsakSøkerErAleneMedBarn}
        />
      </VStack>

      {visDatoForSamvlivsbruddInput && (
        <VStack gap={'6'}>
          <DatePicker {...datepickerProps}>
            <DatePicker.Input
              {...inputProps}
              label={hentTekst('sivilstatus.datovelger.samlivsbrudd', intl)}
              placeholder="DD.MM.YYYY"
            />
          </DatePicker>

          <Alert variant={'info'} size={'small'} inline>
            {hentTekst('sivilstatus.alert.samlivsbrudd', intl)}
          </Alert>
        </VStack>
      )}
    </VStack>
  );
};
