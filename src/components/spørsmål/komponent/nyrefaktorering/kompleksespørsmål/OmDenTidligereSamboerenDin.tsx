import React, { useEffect, useState } from 'react';
import { Checkbox, Heading, TextField, VStack, DatePicker, useDatepicker } from '@navikt/ds-react';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../../utils/søknad';
import { identErGyldig } from '../../../../../utils/validering/validering';

export const OmDenTidligereSamboerenDin: React.FC = () => {
  const intl = useLokalIntlContext();

  const [navn, settNavn] = useState('');
  const [ident, settIdent] = useState('');
  const [visFeil, settVisFeil] = useState(false);
  const [brukerIkkeIdent, settBrukerIkkeIdent] = useState(false);

  const [fødselsdatoVerdi, settFødselsdatoVerdi] = useState<Date | undefined>();
  const [flyttedatoVerdi, settFlyttedatoVerdi] = useState<Date | undefined>();

  // TODO: Husk å sende med flytteDatoVerdi:
  flyttedatoVerdi;

  // TODO: Husk å gjøre det mulig å velge år.
  const fødselsdato = useDatepicker({
    onDateChange: settFødselsdatoVerdi,
  });

  const flyttetFraDato = useDatepicker({
    toDate: new Date(),
    onDateChange: settFlyttedatoVerdi,
  });

  // Liten debounce som stopper feilmelding fra å dukke opp sekundet bruker skriver.
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (ident.trim() !== '' && !brukerIkkeIdent) {
        settVisFeil(!identErGyldig(ident));
      } else {
        settVisFeil(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [ident, brukerIkkeIdent]);

  const skalViseFødselsdato = brukerIkkeIdent;
  const skalViseFlyttedato =
    (brukerIkkeIdent && navn.trim() !== '' && fødselsdatoVerdi) ||
    (!brukerIkkeIdent && navn.trim() !== '' && identErGyldig(ident));

  return (
    <VStack gap="6" align="start">
      <Heading size="small">{hentTekst('sivilstatus.tittel.samlivsbruddAndre', intl)}</Heading>

      <TextField
        label={hentTekst('person.navn', intl)}
        value={navn}
        onChange={(e) => settNavn(e.target.value)}
      />

      <TextField
        label={hentTekst('person.ident', intl)}
        value={ident}
        maxLength={11}
        onChange={(e) => settIdent(e.target.value)}
        disabled={brukerIkkeIdent}
        error={visFeil ? hentTekst('person.feilmelding.ident', intl) : undefined}
      />

      <Checkbox
        checked={brukerIkkeIdent}
        onChange={(e) => {
          const checked = e.target.checked;

          settBrukerIkkeIdent(checked);

          if (checked) {
            settIdent('');
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
  );
};
