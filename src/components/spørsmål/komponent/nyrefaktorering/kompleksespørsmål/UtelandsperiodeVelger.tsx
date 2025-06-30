import React, { useState } from 'react';
import {
  Alert,
  Button,
  DatePicker,
  Heading,
  HStack,
  Select,
  Textarea,
  VStack,
  useDatepicker,
} from '@navikt/ds-react';
import { TrashIcon, PlusCircleFillIcon } from '@navikt/aksel-icons';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { hentTekst, hentTekstMedVariabel } from '../../../../../utils/søknad';
import { SpørsmålWrapper } from '../SpørsmålWrapper';
import { hentLand } from '../../../../../søknader/felles/steg/1-omdeg/medlemskap/MedlemskapConfig';
import { useSpråkContext } from '../../../../../context/SpråkContext';

interface Utenlandsperiode {
  fraDato?: Date;
  tilDato?: Date;
  land?: string;
  begrunnelse?: string;
  feil?: string;
}

const PeriodeBlokk: React.FC<{
  index: number;
  periode: Utenlandsperiode;
  oppdater: (index: number, data: Partial<Utenlandsperiode>) => void;
  fjern: (index: number) => void;
  intl: ReturnType<typeof useLokalIntlContext>;
  total: number;
}> = ({ index, periode, oppdater, fjern, intl, total }) => {
  const [locale] = useSpråkContext();
  const land = hentLand(locale);

  const fraPicker = useDatepicker({
    defaultSelected: periode.fraDato,
    toDate: new Date(),
    onDateChange: (dato) => oppdater(index, { fraDato: dato }),
  });

  const tilPicker = useDatepicker({
    defaultSelected: periode.tilDato,
    toDate: new Date(),
    onDateChange: (dato) => oppdater(index, { tilDato: dato }),
  });

  return (
    <VStack gap="4">
      <HStack justify="space-between">
        <Heading size="small">
          {hentTekst('medlemskap.periodeBoddIUtlandet.utenlandsopphold', intl)}
          {total > 1 ? ` ${index + 1}` : ''}
        </Heading>
        {total > 1 && (
          <Button variant="tertiary" size="small" icon={<TrashIcon />} onClick={() => fjern(index)}>
            {hentTekst('medlemskap.periodeBoddIUtlandet.slett', intl)}
          </Button>
        )}
      </HStack>

      <SpørsmålWrapper tittel={hentTekst('medlemskap.periodeBoddIUtlandet', intl)}>
        <HStack gap="6">
          <DatePicker {...fraPicker.datepickerProps}>
            <DatePicker.Input {...fraPicker.inputProps} label={hentTekst('periode.fra', intl)} />
          </DatePicker>

          <DatePicker {...tilPicker.datepickerProps}>
            <DatePicker.Input {...tilPicker.inputProps} label={hentTekst('periode.til', intl)} />
          </DatePicker>
        </HStack>

        {periode.feil && (
          <Alert variant="error" size="small">
            {periode.feil}
          </Alert>
        )}

        <Select
          label={hentTekst('medlemskap.periodeBoddIUtlandet.land', intl)}
          value={periode.land || ''}
          onChange={(e) => oppdater(index, { land: e.target.value })}
        >
          <option value={undefined} selected>
            {hentTekst('landVelger.alternativ', intl)}
          </option>

          {land.map((landItem) => (
            <option key={landItem.svar_tekst} value={landItem.svar_tekst}>
              {landItem.svar_tekst}
            </option>
          ))}
        </Select>

        {periode.fraDato && periode.tilDato && periode.land && !periode.feil && (
          <Textarea
            label={hentTekstMedVariabel('medlemskap.periodeBoddIUtlandet.begrunnelse', intl, {
              0: periode.land,
            })}
            value={periode.begrunnelse || ''}
            onChange={(e) => oppdater(index, { begrunnelse: e.target.value })}
            maxLength={1000}
          />
        )}
      </SpørsmålWrapper>
    </VStack>
  );
};

export const UtenlandsperiodeVelger: React.FC = () => {
  const intl = useLokalIntlContext();
  const [perioder, settPerioder] = useState<Utenlandsperiode[]>([{}]);

  const sistePeriode = perioder[perioder.length - 1];

  const visLeggTilUtenlandsopphold =
    !!sistePeriode.fraDato &&
    !!sistePeriode.tilDato &&
    !!sistePeriode.land &&
    !!sistePeriode.begrunnelse?.trim() &&
    !sistePeriode.feil;

  const oppdaterPeriode = (index: number, oppdatert: Partial<Utenlandsperiode>) => {
    settPerioder((forrigePeriode) =>
      forrigePeriode.map((periode, index) =>
        index === index
          ? {
              ...periode,
              ...oppdatert,
              feil: validerDatoer(
                oppdatert.fraDato ?? periode.fraDato,
                oppdatert.tilDato ?? periode.tilDato
              ),
            }
          : periode
      )
    );
  };

  const validerDatoer = (fra?: Date, til?: Date): string | undefined => {
    if (!fra || !til) return undefined;
    if (fra > til) return hentTekst('datovelger.periode.startFørSlutt', intl);
    if (fra.getTime() === til.getTime()) return hentTekst('datovelger.periode.likeDatoer', intl);
    return undefined;
  };

  const leggTilPeriode = () => settPerioder((prev) => [...prev, {}]);

  const fjernPeriode = (index: number) => {
    if (perioder.length > 1) {
      settPerioder((forrigePeriode) => forrigePeriode.filter((_, i) => i !== index));
    }
  };

  return (
    <VStack gap="6">
      {perioder.map((periode, index) => (
        <PeriodeBlokk
          key={index}
          index={index}
          periode={periode}
          oppdater={oppdaterPeriode}
          fjern={fjernPeriode}
          intl={intl}
          total={perioder.length}
        />
      ))}

      {visLeggTilUtenlandsopphold && (
        <SpørsmålWrapper
          tittel={hentTekst('medlemskap.periodeBoddIUtlandet.flereutenlandsopphold', intl)}
        >
          <div>
            <Button variant="tertiary" icon={<PlusCircleFillIcon />} onClick={leggTilPeriode}>
              {hentTekst('medlemskap.periodeBoddIUtlandet.knapp', intl)}
            </Button>
          </div>
        </SpørsmålWrapper>
      )}
    </VStack>
  );
};
