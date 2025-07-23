// UtenlandsoppholdV3.tsx
import React, { useState } from 'react';
import { useLokalIntlContext } from '../../../../../../context/LokalIntlContext';
import { VStack } from '@navikt/ds-react';
import { StegSpørsmål } from '../typer/SpørsmålSvarStruktur';
import { useSpråkContext } from '../../../../../../context/SpråkContext';
import { hentLand } from '../../medlemskap/MedlemskapConfig';
import { UtenlandsoppholdSkjema } from './UtenlandsoppholdSkjema';
import { opprettTomPeriode } from './utils';
import { UtenlandsoppholdFormState } from './typer';

export const UtenlandsoppholdV2: React.FC = () => {
  const intl = useLokalIntlContext();
  const [locale] = useSpråkContext();
  const landListe = hentLand(locale);

  const [perioder, settPerioder] = useState<UtenlandsoppholdFormState[]>([opprettTomPeriode()]);

  const nårOppholdtSøkerSegIUtlandetSpørsmål: StegSpørsmål = {
    id: 'utenlandsperiode',
    spørsmålKey: 'medlemskap.periodeBoddIUtlandet',
  };

  const leggTilNyPeriode = () => {
    settPerioder((prev) => [...prev, opprettTomPeriode()]);
  };

  const slettPeriode = (periodeId: string) => {
    if (perioder.length > 1) {
      settPerioder((prev) => prev.filter((p) => p.id !== periodeId));
    }
  };

  const oppdaterPeriode = (
    periodeId: string,
    oppdateringer: Partial<UtenlandsoppholdFormState>
  ) => {
    settPerioder((prev) =>
      prev.map((periode) => (periode.id === periodeId ? { ...periode, ...oppdateringer } : periode))
    );
  };

  const onLandEndring = (periodeId: string, land: string) => {
    oppdaterPeriode(periodeId, {
      periodeLand: land,
      begrunnelsetekst: '',
      idNummer: '',
      harIkkeIdNummer: false,
      sisteAdresse: '',
    });
  };

  return (
    <VStack gap="8">
      {perioder.map((periode, index) => (
        <UtenlandsoppholdSkjema
          key={periode.id}
          periode={periode}
          periodeIndex={index}
          totaltAntallPerioder={perioder.length}
          landListe={landListe}
          intl={intl}
          nårOppholdtSøkerSegIUtlandetSpørsmål={nårOppholdtSøkerSegIUtlandetSpørsmål}
          onOppdater={(oppdateringer) => oppdaterPeriode(periode.id, oppdateringer)}
          onLandEndring={(land) => onLandEndring(periode.id, land)}
          onSlett={() => slettPeriode(periode.id)}
          onLeggTilNy={leggTilNyPeriode}
        />
      ))}
    </VStack>
  );
};
