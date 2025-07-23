import React, { useState, useMemo } from 'react';
import { useLokalIntlContext } from '../../../../../../context/LokalIntlContext';
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
import { StegSpørsmål } from '../typer/SpørsmålSvarStruktur';
import { SpørsmålWrapper } from '../../../../../../components/spørsmål/v2/SpørsmålWrapper';
import { ILandMedKode } from '../../../../../../models/steg/omDeg/medlemskap';
import { useSpråkContext } from '../../../../../../context/SpråkContext';
import { hentLand } from '../../medlemskap/MedlemskapConfig';
import styles from '../../../../../../components/spørsmål/v2/SpørsmålWrapper.module.css';
import { PlusCircleFillIcon } from '@navikt/aksel-icons';

export const UtenlandsperiodeV2: React.FC = () => {
  const intl = useLokalIntlContext();
  const [locale] = useSpråkContext();
  const landListe = hentLand(locale);

  const [periodeLand, settPeriodeLand] = useState<string>('');
  const [fraDato, settFraDato] = useState<Date | undefined>();
  const [tilDato, settTilDato] = useState<Date | undefined>();

  const nårOppholdtSøkerSegIUtlandetSpørsmål: StegSpørsmål = {
    id: 'utenlandsperiode',
    spørsmålKey: 'medlemskap.periodeBoddIUtlandet',
  };

  const { skalViseUtelandsPeriodeAlert, utenlandsPeriodeAlertTekst } = useMemo(() => {
    if (!fraDato || !tilDato) {
      return { skalViseUtelandsPeriodeAlert: false, utenlandsPeriodeAlertTekst: '' };
    }

    const fraDatoTid = fraDato.getTime();
    const tilDatoTid = tilDato.getTime();

    if (fraDatoTid === tilDatoTid) {
      return {
        skalViseUtelandsPeriodeAlert: true,
        utenlandsPeriodeAlertTekst: hentTekst('datovelger.periode.likeDatoer', intl),
      };
    }

    if (fraDatoTid > tilDatoTid) {
      return {
        visUtelandsPeriodeAlert: true,
        utenlandsPeriodeAlertTekst: hentTekst('datovelger.periode.startFørSlutt', intl),
      };
    }

    return { skalViseUterlandsPeriodeAlert: false, utenlandsPeriodeAlertTekst: '' };
  }, [fraDato, tilDato, intl]);

  const harGyldigDatoperiode = useMemo(() => {
    if (!fraDato || !tilDato) return false;

    const fraDatoTid = fraDato.getTime();
    const tilDatoTid = tilDato.getTime();

    return fraDatoTid < tilDatoTid;
  }, [fraDato, tilDato]);

  const visHvorforOppholdIValgtLandTextArea = harGyldigDatoperiode && periodeLand !== '';
  const visIdNummerTextfield = false;
  const visSisteAdresseIUtlandTextfield = false;
  const visLeggTilUtenlandsperiodeKnapp = false;

  const fraDatoConfig = useDatepicker({
    toDate: new Date(),
    onDateChange: (dato: Date | undefined) => {
      settFraDato(dato);
    },
  });

  const tilDatoConfig = useDatepicker({
    toDate: new Date(),
    onDateChange: (dato: Date | undefined) => {
      settTilDato(dato);
    },
  });

  const onLandEndring = (land: string) => {
    settPeriodeLand(land);
  };

  const begrunnelseLandTekst = hentTekstMedVariabel(
    'medlemskap.periodeBoddIUtlandet.begrunnelse',
    intl,
    { 0: periodeLand }
  );

  return (
    <VStack gap={'6'}>
      <Heading size={'small'}>
        {hentTekst('medlemskap.periodeBoddIUtlandet.utenlandsopphold', intl)}
      </Heading>

      <SpørsmålWrapper spørsmål={nårOppholdtSøkerSegIUtlandetSpørsmål} />

      <HStack gap={'6'}>
        <DatePicker {...fraDatoConfig.datepickerProps}>
          <DatePicker.Input
            {...fraDatoConfig.inputProps}
            label={hentTekst('periode.fra', intl)}
            placeholder={'DD.MM.YYYY'}
          />
        </DatePicker>

        <DatePicker {...tilDatoConfig.datepickerProps}>
          <DatePicker.Input
            {...tilDatoConfig.inputProps}
            label={hentTekst('periode.til', intl)}
            placeholder={'DD.MM.YYYY'}
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
        value={periodeLand}
        onChange={(event) => {
          onLandEndring(event.target.value);
        }}
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

      {visHvorforOppholdIValgtLandTextArea && (
        <Textarea label={begrunnelseLandTekst} maxLength={1000} />
      )}

      {visIdNummerTextfield && (
        <VStack gap={'6'}>
          <VStack gap="4">
            <Heading size="xsmall" className={styles.heading}>
              {hentTekst('medlemskap.periodeBoddIUtlandet.utenlandskIDNummer', intl)}
            </Heading>
            <ReadMore header={hentTekst('medlemskap.hjelpetekst-åpne.begrunnelse', intl)}>
              {hentTekst('medlemskap.hjelpetekst-innhold.begrunnelse', intl)}
            </ReadMore>
          </VStack>

          <Textarea
            label={hentTekst('medlemskap.periodeBoddIUtlandet.utenlandskIDNummer', intl)}
            hideLabel
          />

          <Checkbox checked={undefined} onChange={(event) => {}}>
            {hentTekst('medlemskap.periodeBoddIUtlandet.harIkkeIdNummer', intl)}
          </Checkbox>
        </VStack>
      )}

      {visSisteAdresseIUtlandTextfield && (
        <TextField label={hentTekst('medlemskap.periodeBoddIUtlandet.sisteAdresse', intl)} />
      )}

      {visLeggTilUtenlandsperiodeKnapp && (
        <VStack gap="4">
          <Heading size="xsmall" className={styles.heading}>
            {hentTekst('Har du hatt flere utenlandsopphold de siste 5 årene?', intl)}
          </Heading>

          <div>
            <Button variant="tertiary" icon={<PlusCircleFillIcon />} onClick={() => {}}>
              {hentTekst('medlemskap.periodeBoddIUtlandet.knapp', intl)}
            </Button>
          </div>
        </VStack>
      )}
    </VStack>
  );
};
