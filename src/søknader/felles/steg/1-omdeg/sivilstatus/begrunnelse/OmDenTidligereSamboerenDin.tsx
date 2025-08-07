import React, { FC } from 'react';
import { useLokalIntlContext } from '../../../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../../../utils/teksthåndtering';
import { identErGyldig } from '../../../../../../utils/validering/validering';
import { Checkbox, DatePicker, Heading, TextField, useDatepicker, VStack } from '@navikt/ds-react';
import { useOmDeg } from '../../OmDegContext';
import { harFyltUtSamboerDetaljer } from '../../../../../../utils/person';
import { formatIsoDate } from '../../../../../../utils/dato';

export const OmDenTidligereSamboerenDin: FC = () => {
  const intl = useLokalIntlContext();
  const { sivilstatus, settSivilstatus } = useOmDeg();
  const { tidligereSamboerDetaljer } = sivilstatus;

  const navn = tidligereSamboerDetaljer?.navn?.verdi;
  const ident = tidligereSamboerDetaljer?.ident?.verdi;
  const brukerIkkeIdent = tidligereSamboerDetaljer?.kjennerIkkeIdent;
  const erGyldigIdent = ident ? identErGyldig(ident) : false;
  const feilmelding = hentTekst('person.feilmelding.ident', intl);

  const harNavnInput = Boolean(navn?.trim());
  const harGyldigIdent = Boolean(ident) && erGyldigIdent;

  const fødselsdato = useDatepicker({
    onDateChange: (dato: Date | undefined) => {
      if (dato) settTidligereSamboersFødselsdato(formatIsoDate(dato));
    },
  });

  const flyttetFraDato = useDatepicker({
    toDate: new Date(),
    onDateChange: (dato: Date | undefined) => {
      if (dato) settDatoFlyttetFraHverandre(formatIsoDate(dato));
    },
  });

  const visFødseldatoVelger = harNavnInput && (harGyldigIdent || brukerIkkeIdent);
  const visFlyttedatoVelger = harFyltUtSamboerDetaljer(
    tidligereSamboerDetaljer ?? { kjennerIkkeIdent: false },
    false
  );

  const oppdaterTidligereSamboerDetaljer = (
    oppdateringer: Partial<typeof tidligereSamboerDetaljer>
  ) => {
    settSivilstatus({
      ...sivilstatus,
      tidligereSamboerDetaljer: {
        ...tidligereSamboerDetaljer,
        kjennerIkkeIdent: tidligereSamboerDetaljer?.kjennerIkkeIdent ?? false,
        ...oppdateringer,
      },
    });
  };

  const oppdaterSivilstatus = (oppdateringer: Partial<typeof sivilstatus>) => {
    settSivilstatus({
      ...sivilstatus,
      ...oppdateringer,
    });
  };

  const settTidligereSamboersFødselsdato = (date: string) => {
    oppdaterTidligereSamboerDetaljer({
      fødselsdato: {
        label: hentTekst('datovelger.fødselsdato', intl),
        verdi: date,
      },
    });
  };

  const settDatoFlyttetFraHverandre = (date: string) => {
    oppdaterSivilstatus({
      datoFlyttetFraHverandre: {
        label: hentTekst('sivilstatus.datovelger.flyttetFraHverandre', intl),
        verdi: date,
      },
    });
  };

  const settKjennerIkkeIdent = (checked: boolean) => {
    oppdaterTidligereSamboerDetaljer({ kjennerIkkeIdent: checked });
  };

  const settNavn = (samboerNavn: string) => {
    oppdaterTidligereSamboerDetaljer({
      navn: {
        label: hentTekst('person.navn', intl),
        verdi: samboerNavn,
      },
    });
  };

  const settIdent = (ident: string) => {
    oppdaterTidligereSamboerDetaljer({
      ident: {
        label: hentTekst('person.ident', intl),
        verdi: ident,
      },
    });
  };

  return (
    <VStack gap="6" align="start">
      <Heading size="small">{hentTekst('sivilstatus.tittel.samlivsbruddAndre', intl)}</Heading>

      <TextField
        label={hentTekst('person.navn', intl)}
        onChange={(event) => settNavn(event.target.value)}
        value={tidligereSamboerDetaljer?.navn?.verdi}
      />

      <TextField
        label={hentTekst('person.ident', intl)}
        value={ident}
        maxLength={11}
        onChange={(event) => settIdent(event.target.value)}
        disabled={brukerIkkeIdent}
        error={ident && !erGyldigIdent ? feilmelding : undefined}
      />

      <Checkbox checked={brukerIkkeIdent} onChange={(e) => settKjennerIkkeIdent(e.target.checked)}>
        {hentTekst('person.checkbox.ident', intl)}
      </Checkbox>

      {visFødseldatoVelger && (
        <DatePicker dropdownCaption {...fødselsdato.datepickerProps}>
          <DatePicker.Input
            {...fødselsdato.inputProps}
            label={hentTekst('datovelger.fødselsdato', intl)}
            placeholder="DD.MM.YYYY"
          />
        </DatePicker>
      )}

      {visFlyttedatoVelger && (
        <DatePicker dropdownCaption {...flyttetFraDato.datepickerProps}>
          <DatePicker.Input
            {...flyttetFraDato.inputProps}
            label={hentTekst('sivilstatus.datovelger.flyttetFraHverandre', intl)}
            placeholder="DD.MM.YYYY"
          />
        </DatePicker>
      )}
    </VStack>
  );
};
