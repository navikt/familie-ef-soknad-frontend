import React, { useState, useMemo, useEffect } from 'react';
import { useLokalIntlContext } from '../../../../../../context/LokalIntlContext';
import { VStack, Button, Heading } from '@navikt/ds-react';
import { PlusCircleFillIcon } from '@navikt/aksel-icons';
import { StegSpørsmål } from '../typer/SpørsmålSvarStruktur';
import { useSpråkContext } from '../../../../../../context/SpråkContext';
import { hentLand } from '../../medlemskap/MedlemskapConfig';
import { hentTekst } from '../../../../../../utils/søknad';
import styles from '../komponenter/SpørsmålWrapper.module.css';
import { UtenlandsoppholdSkjema } from './UtenlandsoppholdSkjema';
import { opprettTomPeriode, kanLeggeTilNyPeriode } from './utils';
import { UtenlandsoppholdPeriode } from './typer';

interface Props {
  onPerioderOppdatert: (perioder: UtenlandsoppholdPeriode[]) => void;
}

export const UtenlandsoppholdV2: React.FC<Props> = ({ onPerioderOppdatert }) => {
  const intl = useLokalIntlContext();
  const [locale] = useSpråkContext();
  const landListe = hentLand(locale);

  const [perioder, settPerioder] = useState<UtenlandsoppholdPeriode[]>([opprettTomPeriode()]);

  const spørsmål: StegSpørsmål = {
    id: 'utenlandsperiode',
    spørsmålKey: 'medlemskap.periodeBoddIUtlandet',
  };

  const kanLeggeTilNy = useMemo(
    () => kanLeggeTilNyPeriode(perioder, landListe),
    [perioder, landListe]
  );

  useEffect(() => {
    onPerioderOppdatert(perioder);
  }, [perioder, onPerioderOppdatert]);

  const leggTilNyPeriode = () => {
    settPerioder((gjeldende) => [...gjeldende, opprettTomPeriode()]);
  };

  const slettPeriode = (periodeId: string) => {
    if (perioder.length > 1) {
      settPerioder((gjeldende) => gjeldende.filter((p) => p.id !== periodeId));
    }
  };

  const oppdaterPeriode = (periodeId: string, oppdateringer: Partial<UtenlandsoppholdPeriode>) => {
    settPerioder((gjeldende) =>
      gjeldende.map((periode) =>
        periode.id === periodeId ? { ...periode, ...oppdateringer } : periode
      )
    );
  };

  return (
    <VStack gap="8">
      {perioder.map((periode, index) => (
        <UtenlandsoppholdSkjema
          key={periode.id}
          periode={periode}
          periodeNummer={index + 1}
          totalAntallPerioder={perioder.length}
          landListe={landListe}
          intl={intl}
          spørsmål={spørsmål}
          onOppdater={(oppdateringer) => oppdaterPeriode(periode.id, oppdateringer)}
          onSlett={() => slettPeriode(periode.id)}
        />
      ))}

      {kanLeggeTilNy && (
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
