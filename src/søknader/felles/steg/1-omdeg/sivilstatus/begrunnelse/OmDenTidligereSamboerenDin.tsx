import React, { FC } from 'react';
import { useLokalIntlContext } from '../../../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../../../utils/teksthåndtering';
import { identErGyldig } from '../../../../../../utils/validering/validering';
import { Checkbox, DatePicker, Heading, TextField, useDatepicker, VStack } from '@navikt/ds-react';
import { useOmDeg } from '../../OmDegContext';
import { harFyltUtSamboerDetaljer } from '../../../../../../utils/person';
import { formatISO } from 'date-fns';

export const OmDenTidligereSamboerenDin: FC = () => {
  const intl = useLokalIntlContext();

  const { sivilstatus, settSivilstatus } = useOmDeg();
  const { tidligereSamboerDetaljer } = sivilstatus;

  const ident = sivilstatus.tidligereSamboerDetaljer?.ident?.verdi;
  const brukerIkkeIdent = tidligereSamboerDetaljer?.kjennerIkkeIdent;

  const tilLocaleDateString = (dato: Date) => formatISO(dato, { representation: 'date' });

  const feilmelding: string = hentTekst('person.feilmelding.ident', intl);

  const settTidligereSamboersFødselsdato = (date: string) => {
    settSivilstatus({
      ...sivilstatus,
      tidligereSamboerDetaljer: {
        ...tidligereSamboerDetaljer,
        kjennerIkkeIdent: tidligereSamboerDetaljer?.kjennerIkkeIdent ?? false,
        fødselsdato: {
          label: hentTekst('datovelger.fødselsdato', intl),
          verdi: date,
        },
      },
    });
  };

  const settDatoFlyttetFraHverandre = (date: string, tekstid: string): void => {
    settSivilstatus({
      ...sivilstatus,
      datoFlyttetFraHverandre: {
        label: hentTekst(tekstid, intl),
        verdi: date,
      },
    });
  };

  const settKjennerIkkeIdent = (checked: boolean) => {
    settSivilstatus({
      ...sivilstatus,
      tidligereSamboerDetaljer: {
        ...tidligereSamboerDetaljer,
        kjennerIkkeIdent: checked,
      },
    });
  };

  const settNavn = (e: React.FormEvent<HTMLInputElement>) => {
    settSivilstatus({
      ...sivilstatus,
      tidligereSamboerDetaljer: {
        ...tidligereSamboerDetaljer,
        kjennerIkkeIdent: tidligereSamboerDetaljer?.kjennerIkkeIdent ?? false,
        navn: {
          label: hentTekst('person.navn', intl),
          verdi: e.currentTarget.value,
        },
      },
    });
  };

  const settIdent = (ident: string) => {
    settSivilstatus({
      ...sivilstatus,
      tidligereSamboerDetaljer: {
        ...tidligereSamboerDetaljer,
        kjennerIkkeIdent: tidligereSamboerDetaljer?.kjennerIkkeIdent ?? false,
        ident: {
          label: hentTekst('person.ident', intl),
          verdi: ident,
        },
      },
    });
  };

  const erGyldigIdent = (): boolean => {
    return identErGyldig(sivilstatus.tidligereSamboerDetaljer?.ident?.verdi ?? '');
  };

  const fødselsdato = useDatepicker({
    onDateChange: (dato: Date | undefined) => {
      if (dato) {
        settTidligereSamboersFødselsdato(tilLocaleDateString(dato));
      }
    },
  });

  const flyttetFraDato = useDatepicker({
    toDate: new Date(),
    onDateChange: (dato: Date | undefined) => {
      if (dato) {
        settDatoFlyttetFraHverandre(
          tilLocaleDateString(dato),
          'sivilstatus.datovelger.flyttetFraHverandre'
        );
      }
    },
  });

  const visFødseldatoVelger = brukerIkkeIdent;
  const visFlyttedatoVelger = harFyltUtSamboerDetaljer(
    tidligereSamboerDetaljer ?? { kjennerIkkeIdent: false },
    false
  );

  return (
    <VStack gap="6" align="start">
      <Heading size="small">{hentTekst('sivilstatus.tittel.samlivsbruddAndre', intl)}</Heading>

      <TextField
        label={hentTekst('person.navn', intl)}
        onChange={(e) => settNavn(e)}
        value={tidligereSamboerDetaljer?.navn?.verdi}
      />

      <TextField
        label={hentTekst('person.ident', intl)}
        value={ident}
        maxLength={11}
        onChange={(e) => {
          settIdent(e.target.value);
        }}
        disabled={brukerIkkeIdent}
        error={ident && !erGyldigIdent() ? feilmelding : undefined}
      />

      <Checkbox checked={brukerIkkeIdent} onChange={() => settKjennerIkkeIdent(!brukerIkkeIdent)}>
        {hentTekst('person.checkbox.ident', intl)}
      </Checkbox>

      {visFødseldatoVelger && (
        <DatePicker dropdownCaption {...fødselsdato.datepickerProps}>
          <DatePicker.Input
            {...fødselsdato.inputProps}
            label={hentTekst('datovelger.fødselsdato', intl)}
            placeholder={'DD.MM.YYYY'}
          />
        </DatePicker>
      )}

      {visFlyttedatoVelger && (
        <DatePicker dropdownCaption {...flyttetFraDato.datepickerProps}>
          <DatePicker.Input
            {...flyttetFraDato.inputProps}
            label={hentTekst('sivilstatus.datovelger.flyttetFraHverandre', intl)}
            placeholder={'DD.MM.YYYY'}
          />
        </DatePicker>
      )}
    </VStack>
  );
};
