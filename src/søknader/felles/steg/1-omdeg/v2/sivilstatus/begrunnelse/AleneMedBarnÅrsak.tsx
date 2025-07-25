import React, { useState } from 'react';
import { StegSpørsmål, SvarAlternativ } from '../../komponenter/SpørsmålSvarStruktur';
import { SpørsmålWrapper } from '../../komponenter/SpørsmålWrapper';
import { Alert, VStack } from '@navikt/ds-react';
import { RadioSpørsmål } from '../../komponenter/RadioSpørsmål';
import { hentTekst } from '../../../../../../../utils/søknad';
import { useLokalIntlContext } from '../../../../../../../context/LokalIntlContext';
import { OmDenTidligereSamboerenDin } from './OmDenTidligereSamboerenDin';
import { OmsorgEndringForBarn } from './OmsorgEndringForBarn';
import { DatoForSamlivsbrudd } from './DatoForSamlivsbrudd';
import { useOmDegV2 } from '../../typer/OmDegContextV2';
import LocaleTekst from '../../../../../../../language/LocaleTekst';

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
    { id: 'samlivsbruddForeldre', svarKey: 'sivilstatus.svar.samlivsbruddForeldre' },
    { id: 'samlivsbruddAndre', svarKey: 'sivilstatus.svar.samlivsbruddAndre' },
    { id: 'endringISamværsordning', svarKey: 'sivilstatus.svar.endringISamværsordning' },
    { id: 'aleneFraFødsel', svarKey: 'sivilstatus.svar.aleneFraFødsel' },
    { id: 'dødsfall', svarKey: 'sivilstatus.svar.dødsfall' },
  ];

  const onÅrsakSøkerErAleneMedBarn = (svar: SvarAlternativ) => {
    settSøkerAleneMedBarnÅrsak(svar);

    oppdaterSivilstatus({
      årsakEnslig: svar.id,
    });
  };

  const visDatoForSamvlivsbruddSpørsmål = søkerAleneMedBarnÅrsak?.id === 'samlivsbruddForeldre';
  const visOmDenTidligereSamboerenDinSpørsmål = søkerAleneMedBarnÅrsak?.id === 'samlivsbruddAndre';
  const visOmsorgEndringDatoSpørsmål = søkerAleneMedBarnÅrsak?.id === 'endringISamværsordning';
  const visAleneMedBarnGrunnetDødsfallAlert = søkerAleneMedBarnÅrsak?.id === 'dødsfall';

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
            <LocaleTekst tekst={hentTekst('sivilstatus.alert.dødsfall', intl)}></LocaleTekst>
          </Alert>
        )}
      </VStack>

      {visDatoForSamvlivsbruddSpørsmål && <DatoForSamlivsbrudd />}
      {visOmDenTidligereSamboerenDinSpørsmål && <OmDenTidligereSamboerenDin />}
      {visOmsorgEndringDatoSpørsmål && <OmsorgEndringForBarn />}
    </VStack>
  );
};
