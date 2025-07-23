import React, { useState, useMemo } from 'react';
import { useLokalIntlContext } from '../../../../../../context/LokalIntlContext';
import { VStack, Button, Heading } from '@navikt/ds-react';
import { StegSpørsmål } from '../typer/SpørsmålSvarStruktur';
import { useSpråkContext } from '../../../../../../context/SpråkContext';
import { hentLand } from '../../medlemskap/MedlemskapConfig';
import { hentTekst } from '../../../../../../utils/søknad';
import { PlusCircleFillIcon } from '@navikt/aksel-icons';
import styles from '../komponenter/SpørsmålWrapper.module.css';
import { UtenlandsoppholdSkjema } from './UtenlandsoppholdSkjema';
import { opprettTomPeriode, erPerioderGyldige } from './utils';
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

  const skalViseLeggTilKnapp = useMemo(() => {
    return erPerioderGyldige(perioder, landListe);
  }, [perioder, landListe]);

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
        />
      ))}

      {skalViseLeggTilKnapp && (
        <VStack gap="4">
          <Heading size="xsmall" className={styles.heading}>
            {hentTekst('medlemskap.periodeBoddIUtlandet.flereutenlandsopphold', intl)}
          </Heading>

          <div>
            <Button variant="tertiary" icon={<PlusCircleFillIcon />} onClick={leggTilNyPeriode}>
              {hentTekst('medlemskap.periodeBoddIUtlandet.knapp', intl)}
            </Button>
          </div>
        </VStack>
      )}
    </VStack>
  );
};
