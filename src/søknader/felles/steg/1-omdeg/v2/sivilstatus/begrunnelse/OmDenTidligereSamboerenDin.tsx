import React, { useCallback, useEffect, useState } from 'react';
import { Checkbox, Heading, TextField, VStack, DatePicker, useDatepicker } from '@navikt/ds-react';
import { useLokalIntlContext } from '../../../../../../../context/LokalIntlContext';
import { identErGyldig } from '../../../../../../../utils/validering/validering';
import { hentTekst } from '../../../../../../../utils/søknad';
import { useOmDegV2 } from '../../typer/OmDegContextV2';

export interface DinTidligereSamboer {
  navn: string;
  fødseldato?: Date;
  flytteDato?: Date;
  personIdent?: string;
  brukerIkkeIdent?: boolean; // TODO: Denne verdien kan egentlig omittes
}

export const OmDenTidligereSamboerenDin: React.FC = () => {
  const intl = useLokalIntlContext();
  const { oppdaterSivilstatus, sivilstatusData } = useOmDegV2();

  const eksisterendeSamboer = sivilstatusData.søkerSinTidligereSamboer;

  const [navn, settNavn] = useState(eksisterendeSamboer?.navn || '');
  const [ident, settIdent] = useState(eksisterendeSamboer?.personIdent || '');
  const [visFeil, settVisFeil] = useState(false);
  const [brukerIkkeIdent, settBrukerIkkeIdent] = useState(
    eksisterendeSamboer?.brukerIkkeIdent || false
  );
  const [fødselsdatoVerdi, settFødselsdatoVerdi] = useState<Date | undefined>(
    eksisterendeSamboer?.fødseldato
  );
  const [flyttedatoVerdi, settFlyttedatoVerdi] = useState<Date | undefined>(
    eksisterendeSamboer?.flytteDato
  );

  const oppdaterSamboerData = useCallback(
    (delvisData: Partial<DinTidligereSamboer>) => {
      const oppdatertSamboer: DinTidligereSamboer = {
        navn,
        fødseldato: fødselsdatoVerdi,
        flytteDato: flyttedatoVerdi,
        personIdent: brukerIkkeIdent ? undefined : ident, // TODO: kan være vanskelig å forstå.
        brukerIkkeIdent,
        ...delvisData,
      };

      oppdaterSivilstatus({
        søkerSinTidligereSamboer: oppdatertSamboer,
      });
    },
    [navn, fødselsdatoVerdi, flyttedatoVerdi, ident, brukerIkkeIdent, oppdaterSivilstatus]
  );

  // TODO: Husk å gjøre det mulig å velge år.
  const fødselsdato = useDatepicker({
    onDateChange: (dato: Date | undefined) => {
      settFødselsdatoVerdi(dato);
      oppdaterSamboerData({ fødseldato: dato });
    },
  });

  const flyttetFraDato = useDatepicker({
    toDate: new Date(),
    onDateChange: (dato: Date | undefined) => {
      settFlyttedatoVerdi(dato);
      oppdaterSamboerData({ flytteDato: dato });
    },
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

  const harGyldigNavn = navn.trim() !== '';
  const harGyldigIdent = ident.trim() !== '' && identErGyldig(ident);

  const visFødselsdatoVelger = harGyldigNavn && (harGyldigIdent || brukerIkkeIdent);
  const visFlyttedatoVelger = visFødselsdatoVelger && fødselsdatoVerdi !== undefined;

  const håndterNavnEndring = (verdi: string) => {
    settNavn(verdi);
    oppdaterSamboerData({ navn: verdi });
  };

  const håndterIdentEndring = (verdi: string) => {
    settIdent(verdi);
    oppdaterSamboerData({ personIdent: brukerIkkeIdent ? undefined : verdi });
  };

  const håndterCheckboxEndring = (checked: boolean) => {
    settBrukerIkkeIdent(checked);

    if (checked) {
      settIdent('');
      oppdaterSamboerData({
        brukerIkkeIdent: true,
        personIdent: undefined,
      });
    } else {
      oppdaterSamboerData({
        brukerIkkeIdent: false,
        personIdent: ident,
      });
    }
  };

  return (
    <VStack gap="6" align="start">
      <Heading size="small">{hentTekst('sivilstatus.tittel.samlivsbruddAndre', intl)}</Heading>

      <TextField
        label={hentTekst('person.navn', intl)}
        value={navn}
        onChange={(event) => håndterNavnEndring(event.target.value)}
      />

      <TextField
        label={hentTekst('person.ident', intl)}
        value={ident}
        maxLength={11}
        onChange={(event) => håndterIdentEndring(event.target.value)}
        disabled={brukerIkkeIdent}
        error={visFeil ? hentTekst('person.feilmelding.ident', intl) : undefined}
      />

      <Checkbox
        checked={brukerIkkeIdent}
        onChange={(event) => håndterCheckboxEndring(event.target.checked)}
      >
        {hentTekst('person.checkbox.ident', intl)}
      </Checkbox>

      {visFødselsdatoVelger && (
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
