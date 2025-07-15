import React, { useState } from 'react';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { StegSpørsmål, SvarAlternativ } from '../../../../../models/felles/spørsmålogsvar';
import {
  JaNeiSpørsmålV2,
  useJaNeiBoolean,
} from '../../../../../components/spørsmål/JaNeiSpørsmålV2';
import { Alert, VStack } from '@navikt/ds-react';
import { hentTekst } from '../../../../../utils/søknad';
import { SpørsmålWrapper } from '../../../../../components/spørsmål/SpørsmålWrapper';
import { RadioSpørsmål } from '../../../../../components/spørsmål/RadioSpørsmål';

export const SivilstatusV2: React.FC = () => {
  const intl = useLokalIntlContext();

  const søkerErGiftUtenRegistrering = useJaNeiBoolean();
  const søkerErSeparertEllerSkiltUtenRegistrering = useJaNeiBoolean();
  const hvorforSøkerErAleneMedBarn = useState<SvarAlternativ | undefined>;

  const hvorforSøkerErAleneMedBarnSvarAlternativer: SvarAlternativ[] = [
    {
      id: 'samlivsbruddMedDenAndreForelderen',
      labelKey: 'sivilstatus.svar.samlivsbruddForeldre',
    },
    {
      id: 'samlivsbruddMedNoenAndre',
      labelKey: 'sivilstatus.svar.samlivsbruddAndre',
    },
    {
      id: 'aleneFraFødsel',
      labelKey: 'sivilstatus.svar.aleneFraFødsel',
    },
    {
      id: 'endringIOmsorgForBarn',
      labelKey: 'sivilstatus.svar.endringISamværsordning',
    },
    {
      id: 'aleneGrunnetDødsfall',
      labelKey: 'sivilstatus.svar.dødsfall',
    },
  ];

  const søkerErGiftUtenRegistreringSpørsmål: StegSpørsmål = {
    id: 'søkerErGiftUtenRegistrering',
    spørsmålKey: 'sivilstatus.spm.erUformeltGift',
  };
  const søkerErSeparertEllerSkiltUtenRegistreringSpørsmål: StegSpørsmål = {
    id: 'søkerErSeparertEllerSkiltUtenRegistrering',
    spørsmålKey: 'sivilstatus.spm.erUformeltSeparertEllerSkilt',
  };
  const hvorforErSøkerAleneMedBarnSpørsmål: StegSpørsmål = {
    id: 'hvorforErSøkerAleneMedBarn',
    spørsmålKey: 'sivilstatus.spm.begrunnelse',
  };

  const onSøkerErGiftUtenRegistrering = (svar: SvarAlternativ) => {
    søkerErGiftUtenRegistrering.handleChange(svar);
  };
  const onSøkerErSeparertEllerSkiltUtenRegistrering = (svar: SvarAlternativ) => {
    søkerErSeparertEllerSkiltUtenRegistrering.handleChange(svar);
  };
  const onHvorforSøkerErAleneMedBarn = (svar: SvarAlternativ) => {
    // TODO: Fix me!
  };

  const visSøkerMåDokumentereEkteskapAlert = søkerErGiftUtenRegistrering.erJa;
  const visSøkerErSeparertEllerSkiltUtenRegistreringSpørsmål =
    søkerErGiftUtenRegistrering.erBesvart;
  const visSøkerMåDokumentereSeperasjonEllerSkilsmisseAlert =
    søkerErSeparertEllerSkiltUtenRegistrering.erJa;
  const visHvorforErSøkerAleneMedBarnSpørsmål = søkerErSeparertEllerSkiltUtenRegistrering.erBesvart;

  return (
    <VStack gap={'6'}>
      <VStack gap={'6'}>
        <JaNeiSpørsmålV2
          spørsmål={søkerErGiftUtenRegistreringSpørsmål}
          lesMerTittel={hentTekst('sivilstatus.lesmer-åpne.erUformeltGift', intl)}
          lesMerTekst={hentTekst('sivilstatus.lesmer-innhold.erUformeltGift', intl)}
          onChange={onSøkerErGiftUtenRegistrering}
        />

        {visSøkerMåDokumentereEkteskapAlert && (
          <Alert variant={'info'} size={'small'} inline>
            {hentTekst('sivilstatus.alert.erUformeltGift', intl)}
          </Alert>
        )}
      </VStack>

      {visSøkerErSeparertEllerSkiltUtenRegistreringSpørsmål && (
        <VStack gap={'6'}>
          <JaNeiSpørsmålV2
            spørsmål={søkerErSeparertEllerSkiltUtenRegistreringSpørsmål}
            onChange={onSøkerErSeparertEllerSkiltUtenRegistrering}
          />

          {visSøkerMåDokumentereSeperasjonEllerSkilsmisseAlert && (
            <Alert variant={'info'} size={'small'} inline>
              {hentTekst('sivilstatus.alert.erUformeltSeparertEllerSkilt', intl)}
            </Alert>
          )}
        </VStack>
      )}

      {visHvorforErSøkerAleneMedBarnSpørsmål && (
        <VStack gap={'6'}>
          <SpørsmålWrapper
            spørsmål={hvorforErSøkerAleneMedBarnSpørsmål}
            lesMerTittel={hentTekst('sivilstatus.hjelpetekst-åpne.begrunnelse', intl)}
            lesMerTekst={hentTekst('sivilstatus.hjelpetekst-innhold.begrunnelse', intl)}
          />

          <RadioSpørsmål
            spørsmål={hvorforErSøkerAleneMedBarnSpørsmål}
            svarAlternativer={hvorforSøkerErAleneMedBarnSvarAlternativer}
            valgtVerdi={undefined}
            svarLayout={'vertical'}
            onChange={onHvorforSøkerErAleneMedBarn}
          />
        </VStack>
      )}
    </VStack>
  );
};
