import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Checkbox,
  DatePicker,
  Heading,
  Radio,
  RadioGroup,
  TextField,
  useDatepicker,
  VStack,
} from '@navikt/ds-react';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../../utils/søknad';
import { SpørsmålWrapper } from '../SpørsmålWrapper';
import styles from './PersonopplysningerV2.module.css';
import LocaleTekst from '../../../../../language/LocaleTekst';
import { identErGyldig } from '../../../../../utils/validering/validering';

export const HvorforErDuAleneMedBarn: React.FC = () => {
  const intl = useLokalIntlContext();

  const [aleneMedBarnÅrsak, settAleneMedBarnÅrsak] = useState<string>();
  const [samlivsbruddDatoVerdi, settSamlivsbruddDatoVerdi] = useState<Date | undefined>();
  const [endringIOmsorgDatoVerdi, settEndringIOmsorgDatoVerdi] = useState<Date | undefined>();
  const [oppholdesINorgeMedBarn, settOppholdesINorgeMedBarn] = useState<string>();

  // Om den tidligere samboeren din
  const [samboerNavn, settSamboerNavn] = useState('');
  const [samboerIdent, settSamboerIdent] = useState('');
  const [visFeil, settVisFeil] = useState(false);
  const [brukerIkkeIdent, settBrukerIkkeIdent] = useState(false);

  const [samboerFødselsdatoVerdi, settSamboerFødselsdatoVerdi] = useState<Date | undefined>();
  const [samboerFlyttedatoVerdi, settSamboerFlyttedatoVerdi] = useState<Date | undefined>();

  const skalViseOmDenTidligereSamboerenDin = aleneMedBarnÅrsak === 'samlivsbrudd-med-noen-andre';
  const skalViseDatoForSamlivsbrudd = aleneMedBarnÅrsak === 'samlivsbrudd-med-den-andre-forelderen';
  const skalViseEndringIOmsorg = aleneMedBarnÅrsak === 'endring-i-omsorgen-for-barn';
  const skalViseFødselsdato = brukerIkkeIdent;
  const skalViseFlyttedato =
    (brukerIkkeIdent && samboerNavn.trim() !== '' && samboerFødselsdatoVerdi) ||
    (!brukerIkkeIdent && samboerNavn.trim() !== '' && identErGyldig(samboerIdent));

  const skalViseOppholdMedBarnINorge =
    aleneMedBarnÅrsak === 'jeg-er-alene-med-barn-fra-fødsel' ||
    aleneMedBarnÅrsak === 'jeg-er-alene-med-barn-på-grunn-av-dødsfall' ||
    endringIOmsorgDatoVerdi !== undefined ||
    samlivsbruddDatoVerdi !== undefined ||
    (samboerNavn !== '' &&
      brukerIkkeIdent &&
      samboerFødselsdatoVerdi !== undefined &&
      samboerFlyttedatoVerdi !== undefined) ||
    (samboerNavn !== '' && identErGyldig(samboerIdent) && samboerFlyttedatoVerdi !== undefined);

  const samlivsBruddDato = useDatepicker({
    toDate: new Date(),
    onDateChange: settSamlivsbruddDatoVerdi,
  });

  const endringIOmsorgDato = useDatepicker({
    onDateChange: settEndringIOmsorgDatoVerdi,
  });

  const fødselsdato = useDatepicker({
    onDateChange: settSamboerFødselsdatoVerdi,
  });

  const flyttetFraDato = useDatepicker({
    toDate: new Date(),
    onDateChange: settSamboerFlyttedatoVerdi,
  });

  // Liten debounce som stopper feilmelding fra å dukke opp sekundet bruker skriver.
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (samboerIdent.trim() !== '' && !brukerIkkeIdent) {
        settVisFeil(!identErGyldig(samboerIdent));
      } else {
        settVisFeil(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [samboerIdent, brukerIkkeIdent]);

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
      {skalViseOmDenTidligereSamboerenDin && (
        <VStack gap="6" align="start">
          <Heading size="small">{hentTekst('sivilstatus.tittel.samlivsbruddAndre', intl)}</Heading>

          <TextField
            label={hentTekst('person.navn', intl)}
            value={samboerNavn}
            onChange={(e) => settSamboerNavn(e.target.value)}
          />

          <TextField
            label={hentTekst('person.ident', intl)}
            value={samboerIdent}
            maxLength={11}
            onChange={(e) => settSamboerIdent(e.target.value)}
            disabled={brukerIkkeIdent}
            error={visFeil ? hentTekst('person.feilmelding.ident', intl) : undefined}
          />

          <Checkbox
            checked={brukerIkkeIdent}
            onChange={(e) => {
              const checked = e.target.checked;

              settBrukerIkkeIdent(checked);

              if (checked) {
                settSamboerIdent('');
              }
            }}
          >
            {hentTekst('person.checkbox.ident', intl)}
          </Checkbox>

          {skalViseFødselsdato && (
            <DatePicker {...fødselsdato.datepickerProps}>
              <DatePicker.Input
                {...fødselsdato.inputProps}
                label={hentTekst('datovelger.fødselsdato', intl)}
              />
            </DatePicker>
          )}

          {skalViseFlyttedato && (
            <DatePicker {...flyttetFraDato.datepickerProps}>
              <DatePicker.Input
                {...flyttetFraDato.inputProps}
                label={hentTekst('sivilstatus.datovelger.flyttetFraHverandre', intl)}
              />
            </DatePicker>
          )}
        </VStack>
      )}

      {/* 4. Når skjedde endringen / når skal endringen skje? */}
      {skalViseEndringIOmsorg && (
        <DatePicker {...endringIOmsorgDato.datepickerProps}>
          <DatePicker.Input
            {...endringIOmsorgDato.inputProps}
            label={hentTekst('sivilstatus.datovelger.endring', intl)}
          />
        </DatePicker>
      )}

      {/* 5. Oppholder du og barnet/barna dere i Norge? */}
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
    </VStack>
  );
};
