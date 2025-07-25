import React, { useEffect } from 'react';
import { useLokalIntlContext } from '../../../../../../context/LokalIntlContext';
import { JaNeiSpørsmålV2, useJaNeiBoolean } from '../komponenter/JaNeiSpørsmålV2';
import { Alert, VStack } from '@navikt/ds-react';
import { hentTekst } from '../../../../../../utils/søknad';
import { StegSpørsmål, SvarAlternativ } from '../typer/SpørsmålSvarStruktur';
import { useOmDegV2 } from '../typer/OmDegContextV2';

export const SøkerErSeparertEllerUgift: React.FC = () => {
  const intl = useLokalIntlContext();
  const { oppdaterSivilstatus } = useOmDegV2();

  const søkerErGiftUtenRegistrering = useJaNeiBoolean();
  const søkerErSeparertEllerSkiltUtenRegistrering = useJaNeiBoolean();

  const søkerErGiftUtenRegistreringSpørsmål: StegSpørsmål = {
    id: 'søkerErGiftUtenRegistrering',
    spørsmålKey: 'sivilstatus.spm.erUformeltGift',
  };
  const søkerErSeparertEllerSkiltUtenRegistreringSpørsmål: StegSpørsmål = {
    id: 'søkerErSeparertEllerSkiltUtenRegistrering',
    spørsmålKey: 'sivilstatus.spm.erUformeltSeparertEllerSkilt',
  };

  useEffect(() => {
    oppdaterSivilstatus({
      søkerErGiftUtenRegistrering: søkerErGiftUtenRegistrering.value,
      søkerErSeparertEllerSkiltUtenRegistrering: søkerErSeparertEllerSkiltUtenRegistrering.value,
    });
  }, [
    søkerErGiftUtenRegistrering.value,
    søkerErSeparertEllerSkiltUtenRegistrering.value,
    oppdaterSivilstatus,
  ]);

  const onSøkerErGiftUtenRegistrering = (svar: SvarAlternativ) => {
    søkerErGiftUtenRegistrering.handleChange(svar);
  };

  const onSøkerErSeparertEllerSkiltUtenRegistrering = (svar: SvarAlternativ) => {
    søkerErSeparertEllerSkiltUtenRegistrering.handleChange(svar);
  };

  const visSøkerMåDokumentereEkteskapAlert = søkerErGiftUtenRegistrering.erJa;
  const visSøkerErSeparertEllerSkiltUtenRegistreringSpørsmål =
    søkerErGiftUtenRegistrering.erBesvart;
  const visSøkerMåDokumentereSeperasjonEllerSkilsmisseAlert =
    søkerErSeparertEllerSkiltUtenRegistrering.erJa;

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
    </VStack>
  );
};
