import React, { useMemo } from 'react';
import {
  Alert,
  Button,
  Checkbox,
  DatePicker,
  Heading,
  HStack,
  ReadMore,
  Select,
  Textarea,
  TextField,
  useDatepicker,
  VStack,
} from '@navikt/ds-react';
import { TrashIcon } from '@navikt/aksel-icons';
import { hentTekst, hentTekstMedVariabel } from '../../../../../../utils/søknad';
import { SpørsmålWrapper } from '../komponenter/SpørsmålWrapper';
import styles from '../komponenter/SpørsmålWrapper.module.css';
import { finnLand, utledVisningsregler } from './utils';
import { SkjemaProps } from './typer';

export const UtenlandsoppholdSkjema: React.FC<SkjemaProps> = ({
  periode,
  periodeNummer,
  totalAntallPerioder,
  landListe,
  intl,
  spørsmål,
  onOppdater,
  onSlett,
}) => {
  const valgtLand = useMemo(() => finnLand(periode.land, landListe), [periode.land, landListe]);

  const visningsregler = useMemo(
    () => utledVisningsregler(periode, valgtLand, intl),
    [periode, valgtLand, intl]
  );

  const fraDatoKonfig = useDatepicker({
    toDate: new Date(),
    onDateChange: (dato) => onOppdater({ fraDato: dato }),
  });

  const tilDatoKonfig = useDatepicker({
    toDate: new Date(),
    onDateChange: (dato) => onOppdater({ tilDato: dato }),
  });

  const periodeTittel =
    totalAntallPerioder === 1
      ? hentTekst('medlemskap.periodeBoddIUtlandet.utenlandsopphold', intl)
      : `${hentTekst('medlemskap.periodeBoddIUtlandet.utenlandsopphold', intl)} ${periodeNummer}`;

  const begrunnelseTekst = hentTekstMedVariabel(
    'medlemskap.periodeBoddIUtlandet.begrunnelse',
    intl,
    { 0: periode.land }
  );

  const handleLandEndring = (nyttLand: string) => {
    onOppdater({
      land: nyttLand,
      begrunnelse: '',
      idNummer: '',
      harIkkeIdNummer: false,
      sisteAdresse: '',
    });
  };

  const handleIdNummerCheckbox = (harIkkeId: boolean) => {
    onOppdater({
      harIkkeIdNummer: harIkkeId,
      idNummer: harIkkeId ? '' : periode.idNummer,
      sisteAdresse: harIkkeId ? periode.sisteAdresse : '',
    });
  };

  return (
    <VStack gap="6">
      <HStack gap="6" align="center" justify="space-between">
        <Heading size="small">{periodeTittel}</Heading>

        {totalAntallPerioder > 1 && (
          <Button
            variant="tertiary"
            size="small"
            iconPosition="right"
            icon={<TrashIcon />}
            onClick={onSlett}
          >
            {hentTekst('medlemskap.periodeBoddIUtlandet.slett', intl)}
          </Button>
        )}
      </HStack>

      {periodeNummer === 1 && <SpørsmålWrapper spørsmål={spørsmål} />}

      <HStack gap="6">
        <DatePicker {...fraDatoKonfig.datepickerProps}>
          <DatePicker.Input
            {...fraDatoKonfig.inputProps}
            label={hentTekst('periode.fra', intl)}
            placeholder="DD.MM.YYYY"
          />
        </DatePicker>

        <DatePicker {...tilDatoKonfig.datepickerProps}>
          <DatePicker.Input
            {...tilDatoKonfig.inputProps}
            label={hentTekst('periode.til', intl)}
            placeholder="DD.MM.YYYY"
          />
        </DatePicker>
      </HStack>

      {visningsregler.skalViseAlert && (
        <Alert variant="error" size="small">
          {visningsregler.alertTekst}
        </Alert>
      )}

      <Select
        label={hentTekst('medlemskap.periodeBoddIUtlandet.land', intl)}
        value={periode.land}
        onChange={(e) => handleLandEndring(e.target.value)}
      >
        <option value="" disabled>
          {hentTekst('landVelger.alternativ', intl)}
        </option>
        {landListe.map((land) => (
          <option key={land.id} value={land.svar_tekst}>
            {land.svar_tekst}
          </option>
        ))}
      </Select>

      {visningsregler.skalViseBegrunnelse && (
        <Textarea
          label={begrunnelseTekst}
          maxLength={1000}
          value={periode.begrunnelse}
          onChange={(e) => onOppdater({ begrunnelse: e.target.value })}
        />
      )}

      {visningsregler.skalViseIdNummer && (
        <VStack gap="6">
          <VStack gap="4">
            <Heading size="xsmall" className={styles.heading}>
              {hentTekstMedVariabel('medlemskap.periodeBoddIUtlandet.utenlandskIDNummer', intl, {
                0: periode.land,
              })}
            </Heading>
            <ReadMore header={hentTekst('medlemskap.hjelpetekst-åpne.begrunnelse', intl)}>
              {hentTekst('medlemskap.hjelpetekst-innhold.begrunnelse', intl)}
            </ReadMore>
          </VStack>

          <TextField
            label={hentTekstMedVariabel(
              'medlemskap.periodeBoddIUtlandet.utenlandskIDNummer',
              intl,
              { 0: periode.land }
            )}
            hideLabel
            value={periode.idNummer}
            disabled={periode.harIkkeIdNummer}
            onChange={(e) => onOppdater({ idNummer: e.target.value })}
          />

          <Checkbox
            checked={periode.harIkkeIdNummer}
            onChange={(e) => handleIdNummerCheckbox(e.target.checked)}
          >
            {hentTekstMedVariabel('medlemskap.periodeBoddIUtlandet.harIkkeIdNummer', intl, {
              0: periode.land,
            })}
          </Checkbox>
        </VStack>
      )}

      {visningsregler.skalViseSisteAdresse && (
        <TextField
          label={hentTekstMedVariabel('medlemskap.periodeBoddIUtlandet.sisteAdresse', intl, {
            0: periode.land,
          })}
          value={periode.sisteAdresse}
          onChange={(e) => onOppdater({ sisteAdresse: e.target.value })}
        />
      )}
    </VStack>
  );
};
