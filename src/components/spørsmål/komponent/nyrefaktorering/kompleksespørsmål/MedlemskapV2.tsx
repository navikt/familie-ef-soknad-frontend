import React, { useState } from 'react';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { SpørsmålWrapper } from '../SpørsmålWrapper';
import { hentTekst } from '../../../../../utils/søknad';
import {
  Alert,
  Box,
  DatePicker,
  Heading,
  HStack,
  Radio,
  RadioGroup,
  Select,
  useDatepicker,
  VStack,
} from '@navikt/ds-react';
import styles from './MedlemskapV2.module.css';

export const MedlemskapV2: React.FC = () => {
  const intl = useLokalIntlContext();

  const [oppholdMedBarnINorge, settOppholdMedBarnINorge] = useState<string>();
  const [oppholdINorgeSiste5År, settOppholdINorgeSiste5År] = useState<string>();
  const [oppholdsLandMedBarn, settOppholdsLandMedBarn] = useState<string | undefined>();
  const [utelandsPeriodeFraDatoVerdi, settUtelandsPeriodeFraDatoVerdi] = useState<
    Date | undefined
  >();
  const [utelandsPeriodeTilDatoVerdi, settUtelandsPeriodeTilDatoVerdi] = useState<
    Date | undefined
  >();
  const [utelandsPeriodeLand, settUtelandsPeriodeLand] = useState<string | undefined>();

  const skalViseHvorOppholdMedBarn = oppholdMedBarnINorge === 'nei';
  const skalViseOppholdINorgeSiste5År =
    oppholdMedBarnINorge === 'ja' || oppholdsLandMedBarn !== undefined;
  const skalViseÅrsakForOppholdILand = oppholdINorgeSiste5År === 'nei';

  const [utenlandsPeriodeAlertTekst, settUtenlandsPeriodeAlertTekst] = useState<
    string | undefined
  >();
  const skalViseUtelandsPeriodeAlert = utenlandsPeriodeAlertTekst !== undefined;

  const utlandsPeriodeFraDato = useDatepicker({
    toDate: new Date(),
    onDateChange: (dato) => {
      settUtelandsPeriodeFraDatoVerdi(dato);
      validerUtenlandsPeriode(dato, utelandsPeriodeTilDatoVerdi);
    },
  });

  const utlandsPeriodeTilDato = useDatepicker({
    toDate: new Date(),
    onDateChange: (dato) => {
      settUtelandsPeriodeTilDatoVerdi(dato);
      validerUtenlandsPeriode(utelandsPeriodeFraDatoVerdi, dato);
    },
  });

  const validerUtenlandsPeriode = (fraDato?: Date, tilDato?: Date) => {
    if (!fraDato || !tilDato) {
      settUtenlandsPeriodeAlertTekst(undefined);
      return;
    }

    if (fraDato.getTime() > tilDato.getTime()) {
      settUtenlandsPeriodeAlertTekst(hentTekst('datovelger.periode.startFørSlutt', intl));
    } else if (fraDato.getTime() === tilDato.getTime()) {
      settUtenlandsPeriodeAlertTekst(hentTekst('datovelger.periode.likeDatoer', intl));
    } else {
      settUtenlandsPeriodeAlertTekst(undefined);
    }
  };

  return (
    <VStack gap="6">
      {/* 1. Oppholder du og barnet/barna dere i Norge? */}
      <SpørsmålWrapper tittel={hentTekst('medlemskap.spm.opphold', intl)}>
        <RadioGroup
          legend={hentTekst('medlemskap.spm.opphold', intl)}
          hideLegend
          onChange={settOppholdMedBarnINorge}
          value={oppholdMedBarnINorge}
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

      {/* 2. Hvor oppholder du og barnet/barna dere? */}
      {skalViseHvorOppholdMedBarn && (
        <Select
          label={hentTekst('medlemskap.spm.oppholdsland', intl)}
          value={oppholdsLandMedBarn}
          onChange={(e) => settOppholdsLandMedBarn(e.target.value)}
        >
          <option value={undefined}>- Velg land -</option>
          <option value="norge">Norge</option>
          <option value="sverige">Sverige</option>
          <option value="danmark">Danmark</option>
        </Select>
      )}

      {/* 3. Har du oppholdt deg i Norge de siste 5 årene? */}
      {skalViseOppholdINorgeSiste5År && (
        <SpørsmålWrapper tittel={hentTekst('medlemskap.spm.bosatt', intl)}>
          <RadioGroup
            legend={hentTekst('medlemskap.spm.bosatt', intl)}
            hideLegend
            onChange={settOppholdINorgeSiste5År}
            value={oppholdINorgeSiste5År}
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

      {/* 4. Når oppholdt du deg i utlandet? */}
      {skalViseÅrsakForOppholdILand && (
        <VStack gap={'6'}>
          <Heading size="small" className={styles.heading}>
            {hentTekst('medlemskap.periodeBoddIUtlandet.utenlandsopphold', intl)}
          </Heading>
          <SpørsmålWrapper tittel={hentTekst('medlemskap.periodeBoddIUtlandet', intl)}>
            <HStack gap={'6'}>
              <DatePicker {...utlandsPeriodeFraDato.datepickerProps}>
                <DatePicker.Input
                  {...utlandsPeriodeFraDato.inputProps}
                  label={hentTekst('periode.fra', intl)}
                />
              </DatePicker>
              <DatePicker {...utlandsPeriodeTilDato.datepickerProps}>
                <DatePicker.Input
                  {...utlandsPeriodeTilDato.inputProps}
                  label={hentTekst('periode.til', intl)}
                />
              </DatePicker>
            </HStack>
            {skalViseUtelandsPeriodeAlert && (
              <Alert variant={'error'} size={'small'}>
                {utenlandsPeriodeAlertTekst}
              </Alert>
            )}
            <Select
              label={hentTekst('medlemskap.periodeBoddIUtlandet.land', intl)}
              value={utelandsPeriodeLand}
              onChange={(e) => settUtelandsPeriodeLand(e.target.value)}
            >
              <option value={undefined}>- Velg land -</option>
              <option value="norge">Norge</option>
              <option value="sverige">Sverige</option>
              <option value="danmark">Danmark</option>
            </Select>
          </SpørsmålWrapper>
        </VStack>
      )}
    </VStack>
  );
};
