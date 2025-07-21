import React, { useCallback, useEffect, useState } from 'react';
import { Checkbox, Heading, TextField, VStack, DatePicker, useDatepicker } from '@navikt/ds-react';
import { useLokalIntlContext } from '../../../../../../../context/LokalIntlContext';
import { identErGyldig } from '../../../../../../../utils/validering/validering';
import { hentTekst } from '../../../../../../../utils/søknad';
import styles from './OmDenTidligereSamboerenDin.module.css';

export const OmDenTidligereSamboerenDin: React.FC = () => {
  const intl = useLokalIntlContext();

  const [navn, settNavn] = useState('');
  const [ident, settIdent] = useState('');
  const [visFeil, settVisFeil] = useState(false);
  const [brukerIkkeIdent, settBrukerIkkeIdent] = useState(false);
  const [fødselsdatoVerdi, settFødselsdatoVerdi] = useState<Date | undefined>();
  const [flyttedatoVerdi, settFlyttedatoVerdi] = useState<Date | undefined>();

  // TODO: Husk å gjøre det mulig å velge år.
  const fødselsdato = useDatepicker({
    onDateChange: settFødselsdatoVerdi,
  });

  const flyttetFraDato = useDatepicker({
    toDate: new Date(),
    onDateChange: settFlyttedatoVerdi,
  });

  // Debounce validering av ident
  useEffect(() => {
    if (brukerIkkeIdent) {
      settVisFeil(false);
      return;
    }

    const timeout = setTimeout(() => {
      const trimmetIdent = ident.trim();
      settVisFeil(trimmetIdent !== '' && !identErGyldig(trimmetIdent));
    }, 250);

    return () => clearTimeout(timeout);
  }, [ident, brukerIkkeIdent]);

  const håndterNavnEndring = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    settNavn(e.target.value);
  }, []);

  const håndterIdentEndring = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    settIdent(e.target.value);
  }, []);

  const håndterCheckboxEndring = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const erChecked = e.target.checked;
    settBrukerIkkeIdent(erChecked);

    if (erChecked) {
      settIdent('');
      settVisFeil(false);
    }
  }, []);

  const harGyldigNavn = navn.trim() !== '';
  const harGyldigIdent = ident.trim() !== '' && identErGyldig(ident.trim());

  const visFødseldatoVelger = brukerIkkeIdent;
  const visFlyttedatoVelger =
    harGyldigNavn && (brukerIkkeIdent ? !!fødselsdatoVerdi : harGyldigIdent);

  return (
    <VStack gap="6" align="start">
      <Heading size="small" className={styles.title}>
        {hentTekst('sivilstatus.tittel.samlivsbruddAndre', intl)}
      </Heading>

      <TextField
        label={hentTekst('person.navn', intl)}
        value={navn}
        onChange={håndterNavnEndring}
      />

      <TextField
        label={hentTekst('person.ident', intl)}
        value={ident}
        maxLength={11}
        onChange={håndterIdentEndring}
        disabled={brukerIkkeIdent}
        error={visFeil ? hentTekst('person.feilmelding.ident', intl) : undefined}
      />

      <Checkbox checked={brukerIkkeIdent} onChange={håndterCheckboxEndring}>
        {hentTekst('person.checkbox.ident', intl)}
      </Checkbox>

      {visFødseldatoVelger && (
        <DatePicker {...fødselsdato.datepickerProps}>
          <DatePicker.Input
            {...fødselsdato.inputProps}
            label={hentTekst('datovelger.fødselsdato', intl)}
            placeholder={'DD.MM.YYYY'}
          />
        </DatePicker>
      )}

      {visFlyttedatoVelger && (
        <DatePicker {...flyttetFraDato.datepickerProps}>
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
