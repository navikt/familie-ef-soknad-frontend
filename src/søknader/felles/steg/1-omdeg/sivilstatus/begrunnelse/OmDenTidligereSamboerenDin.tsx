import React, { FC } from 'react';
import { useLokalIntlContext } from '../../../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../../../utils/teksthåndtering';
import { identErGyldig } from '../../../../../../utils/validering/validering';
import { Checkbox, Heading, TextField, VStack } from '@navikt/ds-react';
import { useOmDeg } from '../../OmDegContext';
import { Datovelger } from '../../../../../../components/dato/Datovelger';
import { GyldigeDatoer } from '../../../../../../components/dato/GyldigeDatoer';

export const OmDenTidligereSamboerenDin: FC = () => {
  const intl = useLokalIntlContext();
  const { sivilstatus, settSivilstatus } = useOmDeg();
  const { tidligereSamboerDetaljer, datoFlyttetFraHverandre } = sivilstatus;

  const navn = tidligereSamboerDetaljer?.navn?.verdi;
  const ident = tidligereSamboerDetaljer?.ident?.verdi;
  const brukerIkkeIdent = tidligereSamboerDetaljer?.kjennerIkkeIdent;
  const erGyldigIdent = ident ? identErGyldig(ident) : false;
  const feilmelding = hentTekst('person.feilmelding.ident', intl);
  const fødselsdatoVerdi = tidligereSamboerDetaljer?.fødselsdato?.verdi;

  const harNavnInput = Boolean(navn?.trim());
  const harIdentInput = Boolean(ident?.trim());
  const harFødselsdato = Boolean(fødselsdatoVerdi);

  const visFødseldatoVelger = brukerIkkeIdent;
  const visFlyttedatoVelger =
    (harNavnInput && harIdentInput) || (harNavnInput && brukerIkkeIdent && harFødselsdato);

  const oppdaterTidligereSamboerDetaljer = (data: Partial<typeof tidligereSamboerDetaljer>) => {
    settSivilstatus({
      ...sivilstatus,
      tidligereSamboerDetaljer: {
        ...tidligereSamboerDetaljer,
        kjennerIkkeIdent: tidligereSamboerDetaljer?.kjennerIkkeIdent ?? false,
        ...data,
      },
    });
  };

  const oppdaterSivilstatus = (data: Partial<typeof sivilstatus>) => {
    settSivilstatus({
      ...sivilstatus,
      ...data,
    });
  };

  const settTidligereSamboersFødselsdato = (dato: string) => {
    oppdaterTidligereSamboerDetaljer({
      fødselsdato: {
        label: hentTekst('datovelger.fødselsdato', intl),
        verdi: dato,
      },
    });
  };

  const settDatoFlyttetFraHverandre = (dato: string) => {
    oppdaterSivilstatus({
      datoFlyttetFraHverandre: {
        label: hentTekst('sivilstatus.datovelger.flyttetFraHverandre', intl),
        verdi: dato,
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
    <VStack gap="space-24" align="start">
      <Heading size="small">{hentTekst('sivilstatus.tittel.samlivsbruddAndre', intl)}</Heading>

      <TextField
        label={hentTekst('person.navn', intl)}
        onChange={(event) => settNavn(event.target.value)}
        value={tidligereSamboerDetaljer?.navn?.verdi}
      />

      <TextField
        label={hentTekst('person.ident', intl)}
        value={brukerIkkeIdent ? '' : ident}
        maxLength={11}
        onChange={(event) => settIdent(event.target.value)}
        disabled={brukerIkkeIdent}
        error={ident && !erGyldigIdent ? feilmelding : undefined}
      />

      <Checkbox checked={brukerIkkeIdent} onChange={(e) => settKjennerIkkeIdent(e.target.checked)}>
        {hentTekst('person.checkbox.ident', intl)}
      </Checkbox>

      {visFødseldatoVelger && (
        <Datovelger
          valgtDato={tidligereSamboerDetaljer?.fødselsdato?.verdi || ''}
          tekstid={'datovelger.fødselsdato'}
          gyldigeDatoer={GyldigeDatoer.Tidligere}
          settDato={(dato) => settTidligereSamboersFødselsdato(dato)}
        />
      )}

      {visFlyttedatoVelger && (
        <Datovelger
          settDato={(dato) => settDatoFlyttetFraHverandre(dato)}
          valgtDato={datoFlyttetFraHverandre ? datoFlyttetFraHverandre.verdi : undefined}
          tekstid={'sivilstatus.datovelger.flyttetFraHverandre'}
          gyldigeDatoer={GyldigeDatoer.Alle}
        />
      )}
    </VStack>
  );
};
