import React, { useState } from 'react';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import {
  Alert,
  Button,
  DatePicker,
  Heading,
  HStack,
  Select,
  Textarea,
  useDatepicker,
  VStack,
} from '@navikt/ds-react';
import styles from './UtenlandsperioderVelger.module.css';
import { hentTekst, hentTekstMedVariabel } from '../../../../../utils/søknad';
import { SpørsmålWrapper } from '../SpørsmålWrapper';
import { PlusCircleFillIcon, TrashIcon } from '@navikt/aksel-icons';

interface Utelandsperiode {
  fraDato: Date;
  tilDato: Date;
  land: string;
  begrunnelse: string;
}

export const UtelandsperiodeVelger: React.FC = () => {
  const intl = useLokalIntlContext();

  const [utelandsPeriodeFraDatoVerdi, settUtelandsPeriodeFraDatoVerdi] = useState<
    Date | undefined
  >();
  const [utelandsPeriodeTilDatoVerdi, settUtelandsPeriodeTilDatoVerdi] = useState<
    Date | undefined
  >();
  const [utelandsPeriodeLand, settUtelandsPeriodeLand] = useState<string | undefined>();

  const [utenlandsPeriodeAlertTekst, settUtenlandsPeriodeAlertTekst] = useState<
    string | undefined
  >();

  const skalViseUtelandsPeriodeAlert = utenlandsPeriodeAlertTekst !== undefined;
  const skalViseIHvilketLandOppholdDuDegIInput =
    utelandsPeriodeLand !== undefined &&
    utenlandsPeriodeAlertTekst === undefined &&
    utelandsPeriodeFraDatoVerdi !== undefined &&
    utelandsPeriodeTilDatoVerdi !== undefined;
  const skalViseLeggTilUtenlandsPeriode = true;

  const utlandsPeriodeFraDato = useDatepicker({
    toDate: new Date(),
    onDateChange: (dato) => {
      settUtelandsPeriodeFraDatoVerdi(dato);
      validerUtenlandsPeriodeDatoer(dato, utelandsPeriodeTilDatoVerdi);
    },
  });

  const utlandsPeriodeTilDato = useDatepicker({
    toDate: new Date(),
    onDateChange: (dato) => {
      settUtelandsPeriodeTilDatoVerdi(dato);
      validerUtenlandsPeriodeDatoer(utelandsPeriodeFraDatoVerdi, dato);
    },
  });

  const validerUtenlandsPeriodeDatoer = (fraDato?: Date, tilDato?: Date) => {
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
    <VStack gap={'6'}>
      <HStack className={styles.headerRad}>
        <Heading size="small">
          {hentTekst('medlemskap.periodeBoddIUtlandet.utenlandsopphold', intl)}
        </Heading>
        <Button
          variant="tertiary"
          size="small"
          iconPosition="right"
          icon={<TrashIcon />}
          className={styles.slettKnapp}
        >
          {hentTekst('medlemskap.periodeBoddIUtlandet.slett', intl)}
        </Button>
      </HStack>

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
          <option value="Norge">Norge</option>
          <option value="Sverige">Sverige</option>
          <option value="Danmark">Danmark</option>
        </Select>

        {skalViseIHvilketLandOppholdDuDegIInput && (
          <Textarea
            label={hentTekstMedVariabel('medlemskap.periodeBoddIUtlandet.begrunnelse', intl, {
              0: utelandsPeriodeLand || '',
            })}
            maxLength={1000}
          />
        )}
      </SpørsmålWrapper>
      {skalViseLeggTilUtenlandsPeriode && (
        <SpørsmålWrapper
          tittel={hentTekst('medlemskap.periodeBoddIUtlandet.flereutenlandsopphold', intl)}
        >
          <div>
            <Button variant="tertiary" icon={<PlusCircleFillIcon />}>
              {hentTekst('medlemskap.periodeBoddIUtlandet.knapp', intl)}
            </Button>
          </div>
        </SpørsmålWrapper>
      )}
    </VStack>
  );
};
