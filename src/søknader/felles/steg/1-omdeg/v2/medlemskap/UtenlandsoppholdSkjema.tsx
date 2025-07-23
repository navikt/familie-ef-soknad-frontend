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
import { hentTekst, hentTekstMedVariabel } from '../../../../../../utils/søknad';
import { SpørsmålWrapper } from '../../../../../../components/spørsmål/v2/SpørsmålWrapper';
import { ILandMedKode } from '../../../../../../models/steg/omDeg/medlemskap';
import styles from '../../../../../../components/spørsmål/v2/SpørsmålWrapper.module.css';
import { PlusCircleFillIcon, TrashIcon } from '@navikt/aksel-icons';
import { validerPeriode } from './utils';
import { UtenlandsoppholdSkjemaProps } from './typer';

export const UtenlandsoppholdSkjema: React.FC<UtenlandsoppholdSkjemaProps> = ({
  periode,
  periodeIndex,
  totaltAntallPerioder,
  landListe,
  intl,
  nårOppholdtSøkerSegIUtlandetSpørsmål,
  onOppdater,
  onLandEndring,
  onSlett,
  onLeggTilNy,
}) => {
  const valgtLand = useMemo(() => {
    return landListe.find((land) => land.svar_tekst === periode.periodeLand);
  }, [landListe, periode.periodeLand]);

  const validering = useMemo(() => {
    return validerPeriode(periode, valgtLand, intl);
  }, [periode, valgtLand, intl]);

  const fraDatoConfig = useDatepicker({
    toDate: new Date(),
    onDateChange: (dato: Date | undefined) => {
      onOppdater({ fraDato: dato });
    },
  });

  const tilDatoConfig = useDatepicker({
    toDate: new Date(),
    onDateChange: (dato: Date | undefined) => {
      onOppdater({ tilDato: dato });
    },
  });

  const overskriftTekst =
    totaltAntallPerioder === 1
      ? hentTekst('medlemskap.periodeBoddIUtlandet.utenlandsopphold', intl)
      : `${hentTekst('medlemskap.periodeBoddIUtlandet.utenlandsopphold', intl)} ${periodeIndex + 1}`;

  const visSlettKnapp = totaltAntallPerioder > 1;

  const begrunnelseLandTekst = hentTekstMedVariabel(
    'medlemskap.periodeBoddIUtlandet.begrunnelse',
    intl,
    { 0: periode.periodeLand }
  );

  const utenlandskIdNummerTekst = hentTekstMedVariabel(
    'medlemskap.periodeBoddIUtlandet.utenlandskIDNummer',
    intl,
    { 0: periode.periodeLand }
  );

  const harIkkeIdNummerTekst = hentTekstMedVariabel(
    'medlemskap.periodeBoddIUtlandet.harIkkeIdNummer',
    intl,
    { 0: periode.periodeLand }
  );

  const sisteAdresseTekst = hentTekstMedVariabel(
    'medlemskap.periodeBoddIUtlandet.sisteAdresse',
    intl,
    { 0: periode.periodeLand }
  );

  return (
    <VStack gap="6">
      <HStack gap="6" align="center" justify="space-between">
        <Heading size="small">{overskriftTekst}</Heading>

        {visSlettKnapp && (
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

      {periodeIndex === 0 && <SpørsmålWrapper spørsmål={nårOppholdtSøkerSegIUtlandetSpørsmål} />}

      <HStack gap="6">
        <DatePicker {...fraDatoConfig.datepickerProps}>
          <DatePicker.Input
            {...fraDatoConfig.inputProps}
            label={hentTekst('periode.fra', intl)}
            placeholder="DD.MM.YYYY"
            value={periode.fraDato ? fraDatoConfig.inputProps.value : ''}
          />
        </DatePicker>

        <DatePicker {...tilDatoConfig.datepickerProps}>
          <DatePicker.Input
            {...tilDatoConfig.inputProps}
            label={hentTekst('periode.til', intl)}
            placeholder="DD.MM.YYYY"
            value={periode.tilDato ? tilDatoConfig.inputProps.value : ''}
          />
        </DatePicker>
      </HStack>

      {validering.skalViseAlert && (
        <Alert variant="error" size="small">
          {validering.alertTekst}
        </Alert>
      )}

      <Select
        label={hentTekst('medlemskap.periodeBoddIUtlandet.land', intl)}
        value={periode.periodeLand}
        onChange={(event) => onLandEndring(event.target.value)}
      >
        <option value="" disabled>
          {hentTekst('landVelger.alternativ', intl)}
        </option>

        {landListe.map((land: ILandMedKode) => (
          <option key={land.id} value={land.svar_tekst}>
            {land.svar_tekst}
          </option>
        ))}
      </Select>

      {validering.visHvorforOppholdTextArea && (
        <Textarea
          label={begrunnelseLandTekst}
          maxLength={1000}
          value={periode.begrunnelsetekst}
          onChange={(event) => onOppdater({ begrunnelsetekst: event.target.value })}
        />
      )}

      {validering.visIdNummerTextfield && (
        <VStack gap="6">
          <VStack gap="4">
            <Heading size="xsmall" className={styles.heading}>
              {utenlandskIdNummerTekst}
            </Heading>
            <ReadMore header={hentTekst('medlemskap.hjelpetekst-åpne.begrunnelse', intl)}>
              {hentTekst('medlemskap.hjelpetekst-innhold.begrunnelse', intl)}
            </ReadMore>
          </VStack>

          <TextField
            label={utenlandskIdNummerTekst}
            hideLabel
            value={periode.idNummer}
            disabled={periode.harIkkeIdNummer}
            onChange={(event) => onOppdater({ idNummer: event.target.value })}
          />

          <Checkbox
            checked={periode.harIkkeIdNummer}
            onChange={(event) => {
              const checked = event.target.checked;
              onOppdater({
                harIkkeIdNummer: checked,
                idNummer: checked ? '' : periode.idNummer,
                sisteAdresse: checked ? periode.sisteAdresse : '',
              });
            }}
          >
            {harIkkeIdNummerTekst}
          </Checkbox>
        </VStack>
      )}

      {validering.visSisteAdresseTextfield && (
        <TextField
          label={sisteAdresseTekst}
          value={periode.sisteAdresse}
          onChange={(event) => onOppdater({ sisteAdresse: event.target.value })}
        />
      )}

      {validering.visLeggTilKnapp && (
        <VStack gap="4">
          <Heading size="xsmall" className={styles.heading}>
            {hentTekst('Har du hatt flere utenlandsopphold de siste 5 årene?', intl)}
          </Heading>

          <div>
            <Button variant="tertiary" icon={<PlusCircleFillIcon />} onClick={onLeggTilNy}>
              {hentTekst('medlemskap.periodeBoddIUtlandet.knapp', intl)}
            </Button>
          </div>
        </VStack>
      )}
    </VStack>
  );
};
