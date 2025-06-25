import React, { useState } from 'react';
import { Alert, Box, DatePicker, Radio, RadioGroup, useDatepicker, VStack } from '@navikt/ds-react';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../../utils/søknad';
import { SpørsmålWrapper } from '../SpørsmålWrapper';
import styles from './PersonopplysningerV2.module.css';
import LocaleTekst from '../../../../../language/LocaleTekst';
import { OmDenTidligereSamboerenDin } from './OmDenTidligereSamboerenDin';

export const HvorforErDuAleneMedBarn: React.FC = () => {
  const intl = useLokalIntlContext();

  const [aleneMedBarnÅrsak, settAleneMedBarnÅrsak] = useState<string>();
  const [samlivsbruddDatoVerdi, settSamlivsbruddDatoVerdi] = useState<Date | undefined>();
  const [endringIOmsorgDatoVerdi, settEndringIOmsorgDatoVerdi] = useState<Date | undefined>();
  const [oppholdesINorgeMedBarn, settOppholdesINorgeMedBarn] = useState<string>();

  const skalViseOmDenTidligereSamboerenDin = aleneMedBarnÅrsak === 'samlivsbrudd-med-noen-andre';
  const skalViseDatoForSamlivsbrudd = aleneMedBarnÅrsak === 'samlivsbrudd-med-den-andre-forelderen';
  const skalViseOppholdMedBarnINorge =
    aleneMedBarnÅrsak === 'jeg-er-alene-med-barn-fra-fødsel' ||
    aleneMedBarnÅrsak === 'jeg-er-alene-med-barn-på-grunn-av-dødsfall';
  const skalViseEndringIOmsorg = aleneMedBarnÅrsak === 'endring-i-omsorgen-for-barn';

  const samlivsBruddDato = useDatepicker({
    toDate: new Date(),
    onDateChange: settSamlivsbruddDatoVerdi,
  });

  const endringIOmsorgDato = useDatepicker({
    onDateChange: settEndringIOmsorgDatoVerdi,
  });

  return (
    <VStack gap="6">
      {/* 1. Hvorfor er du alene med barn? */}
      <SpørsmålWrapper
        tittel={hentTekst('sivilstatus.spm.begrunnelse', intl)}
        lesMerTittel={hentTekst('sivilstatus.hjelpetekst-åpne.begrunnelse', intl)}
        lesMerTekst={hentTekst('sivilstatus.hjelpetekst-innhold.begrunnelse', intl)}
      >
        <RadioGroup
          legend={hentTekst('sivilstatus.spm.begrunnelse', intl)}
          hideLegend
          onChange={settAleneMedBarnÅrsak}
          value={aleneMedBarnÅrsak}
        >
          <div className={styles.stackVertical}>
            <Box className={styles.radioBox}>
              <Radio value="samlivsbrudd-med-den-andre-forelderen">
                {hentTekst('sivilstatus.svar.samlivsbruddForeldre', intl)}
              </Radio>
            </Box>
            <Box className={styles.radioBox}>
              <Radio value="samlivsbrudd-med-noen-andre">
                {hentTekst('sivilstatus.svar.samlivsbruddAndre', intl)}
              </Radio>
            </Box>
            <Box className={styles.radioBox}>
              <Radio value="jeg-er-alene-med-barn-fra-fødsel">
                {hentTekst('sivilstatus.svar.aleneFraFødsel', intl)}
              </Radio>
            </Box>
            <Box className={styles.radioBox}>
              <Radio value="endring-i-omsorgen-for-barn">
                {hentTekst('sivilstatus.svar.endringISamværsordning', intl)}
              </Radio>
            </Box>
            <Box className={styles.radioBox}>
              <Radio value="jeg-er-alene-med-barn-på-grunn-av-dødsfall">
                {hentTekst('sivilstatus.svar.dødsfall', intl)}
              </Radio>
            </Box>
          </div>
        </RadioGroup>

        {aleneMedBarnÅrsak === 'jeg-er-alene-med-barn-på-grunn-av-dødsfall' && (
          <Alert variant="info" inline>
            <LocaleTekst tekst="sivilstatus.alert.dødsfall" />
          </Alert>
        )}
      </SpørsmålWrapper>

      {/* 2. Dato for samlivsbrudd. */}
      {skalViseDatoForSamlivsbrudd && (
        <VStack gap={'6'}>
          <DatePicker {...samlivsBruddDato.datepickerProps}>
            <DatePicker.Input
              {...samlivsBruddDato.inputProps}
              label={hentTekst('sivilstatus.datovelger.samlivsbrudd', intl)}
            />
          </DatePicker>
          <Alert variant="info" inline size={'small'}>
            {hentTekst('sivilstatus.alert.samlivsbrudd', intl)}
          </Alert>
        </VStack>
      )}

      {/* 3. Om  den tidligere samboeren din. */}
      {skalViseOmDenTidligereSamboerenDin && <OmDenTidligereSamboerenDin />}

      {/* 4. Oppholder du og barnet/barna dere i Norge? */}
      {skalViseOppholdMedBarnINorge && (
        <SpørsmålWrapper tittel={hentTekst('medlemskap.spm.opphold', intl)}>
          <RadioGroup
            legend={hentTekst('medlemskap.spm.opphold', intl)}
            hideLegend
            onChange={settOppholdesINorgeMedBarn}
            value={oppholdesINorgeMedBarn}
          >
            <div className={styles.stackHorizontal}>
              <Box className={styles.radioBox}>
                <Radio value="ja">{hentTekst('svar.ja', intl)}</Radio>
              </Box>
              <Box className={styles.radioBox}>
                <Radio value="nei">{hentTekst('svar.nei', intl)}</Radio>
              </Box>
            </div>
          </RadioGroup>
        </SpørsmålWrapper>
      )}

      {/* 5. Når skjedde endringen / når skal endringen skje? */}
      {skalViseEndringIOmsorg && (
        <DatePicker {...endringIOmsorgDato.datepickerProps}>
          <DatePicker.Input
            {...endringIOmsorgDato.inputProps}
            label={hentTekst('sivilstatus.datovelger.endring', intl)}
          />
        </DatePicker>
      )}
    </VStack>
  );
};
