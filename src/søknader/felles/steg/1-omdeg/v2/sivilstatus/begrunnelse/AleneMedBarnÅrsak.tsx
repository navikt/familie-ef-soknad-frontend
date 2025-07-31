import React, { useState } from 'react';
import { StegSpørsmål, SvarAlternativ } from '../../komponenter/SpørsmålSvarStruktur';
import { SpørsmålWrapper } from '../../komponenter/SpørsmålWrapper';
import { Alert, VStack } from '@navikt/ds-react';
import { RadioSpørsmål } from '../../komponenter/RadioSpørsmål';
import { useLokalIntlContext } from '../../../../../../../context/LokalIntlContext';
import { OmDenTidligereSamboerenDin } from './OmDenTidligereSamboerenDin';
import { OmsorgEndringForBarn } from './OmsorgEndringForBarn';
import { DatoForSamlivsbrudd } from './DatoForSamlivsbrudd';
import { useOmDegV2 } from '../../typer/OmDegContextV2';
import { hentHTMLTekst, hentTekst } from '../../../../../../../utils/teksthåndtering';

export enum ÅrsakAleneMedBarn {
  samlivsbruddForeldre = 'samlivsbruddForeldre',
  samlivsbruddAndre = 'samlivsbruddAndre',
  endringISamværsordning = 'endringISamværsordning',
  aleneFraFødsel = 'aleneFraFødsel',
  dødsfall = 'dødsfall',
}

export const AleneMedBarnÅrsak: React.FC = () => {
  const intl = useLokalIntlContext();

  const { oppdaterSivilstatus } = useOmDegV2();

  const [søkerAleneMedBarnÅrsak, settSøkerAleneMedBarnÅrsak] = useState<
    SvarAlternativ | undefined
  >();

  const hvorforErDuAleneMedBarnSpørsmål: StegSpørsmål = {
    id: 'årsakEnslig',
    spørsmålKey: 'sivilstatus.spm.begrunnelse',
  };

  const hvorforAlenedMedBarnSvarAlternativer: SvarAlternativ[] = [
    {
      id: ÅrsakAleneMedBarn.samlivsbruddForeldre,
      svarKey: 'sivilstatus.svar.samlivsbruddForeldre',
    },
    { id: ÅrsakAleneMedBarn.samlivsbruddAndre, svarKey: 'sivilstatus.svar.samlivsbruddAndre' },
    {
      id: ÅrsakAleneMedBarn.endringISamværsordning,
      svarKey: 'sivilstatus.svar.endringISamværsordning',
    },
    { id: ÅrsakAleneMedBarn.aleneFraFødsel, svarKey: 'sivilstatus.svar.aleneFraFødsel' },
    { id: ÅrsakAleneMedBarn.dødsfall, svarKey: 'sivilstatus.svar.dødsfall' },
  ];

  const onÅrsakSøkerErAleneMedBarn = (svar: SvarAlternativ) => {
    settSøkerAleneMedBarnÅrsak(svar);

    oppdaterSivilstatus({
      årsakEnslig: svar.id,
    });
  };

  const visDatoForSamvlivsbruddSpørsmål =
    søkerAleneMedBarnÅrsak?.id === ÅrsakAleneMedBarn.samlivsbruddForeldre;
  const visOmDenTidligereSamboerenDinSpørsmål =
    søkerAleneMedBarnÅrsak?.id === ÅrsakAleneMedBarn.samlivsbruddAndre;
  const visOmsorgEndringDatoSpørsmål =
    søkerAleneMedBarnÅrsak?.id === ÅrsakAleneMedBarn.endringISamværsordning;
  const visAleneMedBarnGrunnetDødsfallAlert =
    søkerAleneMedBarnÅrsak?.id === ÅrsakAleneMedBarn.dødsfall;

  return (
    <VStack gap={'6'}>
      <VStack gap={'6'}>
        <SpørsmålWrapper
          spørsmål={hvorforErDuAleneMedBarnSpørsmål}
          lesMerTittel={hentTekst('sivilstatus.hjelpetekst-åpne.begrunnelse', intl)}
          lesMerTekst={hentTekst('sivilstatus.hjelpetekst-innhold.begrunnelse', intl)}
        />

        <RadioSpørsmål
          spørsmål={hvorforErDuAleneMedBarnSpørsmål}
          svarAlternativer={hvorforAlenedMedBarnSvarAlternativer}
          valgtVerdi={undefined}
          svarLayout={'vertical'}
          onChange={onÅrsakSøkerErAleneMedBarn}
        />

        {visAleneMedBarnGrunnetDødsfallAlert && (
          <Alert variant={'info'} size={'small'} inline>
            {hentHTMLTekst('sivilstatus.alert.dødsfall', intl)}
          </Alert>
        )}
      </VStack>

      {visDatoForSamvlivsbruddSpørsmål && <DatoForSamlivsbrudd />}
      {visOmDenTidligereSamboerenDinSpørsmål && <OmDenTidligereSamboerenDin />}
      {visOmsorgEndringDatoSpørsmål && <OmsorgEndringForBarn />}
    </VStack>
  );
};
