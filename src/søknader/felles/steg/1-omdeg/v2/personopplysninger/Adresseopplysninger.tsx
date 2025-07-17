import React, { useEffect } from 'react';
import { Alert, Heading, VStack } from '@navikt/ds-react';
import {
  JaNeiSpørsmålV2,
  useJaNeiBoolean,
} from '../../../../../../components/spørsmål/v2/JaNeiSpørsmålV2';
import LocaleTekst from '../../../../../../language/LocaleTekst';
import styles from './Adresseopplysninger.module.css';
import { hentTekst } from '../../../../../../utils/søknad';
import { useLokalIntlContext } from '../../../../../../context/LokalIntlContext';
import { StegSpørsmål, SvarAlternativ } from '../typer/SpørsmålSvarStruktur';
import { useOmDegV2 } from '../typer/OmDegContextV2';

export const Adresseopplysninger: React.FC = () => {
  const intl = useLokalIntlContext();
  const { oppdaterPersonopplysninger } = useOmDegV2();

  const søkerBorPåRegistrertAdresse = useJaNeiBoolean();
  const søkerHarMeldtAdresseEndring = useJaNeiBoolean();

  const søkerBorPåReigstrertAdresseSpørsmål: StegSpørsmål = {
    id: 'søkerBorPåRegistretAdresse',
    spørsmålKey: 'personopplysninger.spm.riktigAdresse',
  };
  const søkerHarMeldtAdresseEndringSpørsmål: StegSpørsmål = {
    id: 'søkerHarMeldtAdresseEndring',
    spørsmålKey: 'personopplysninger.spm.meldtAdresseendring',
  };

  useEffect(() => {
    oppdaterPersonopplysninger({
      søkerBorPåRegistrertAdresse: søkerBorPåRegistrertAdresse.value,
      søkerHarMeldtAdresseEndring: søkerHarMeldtAdresseEndring.value,
    });
  }, [
    søkerBorPåRegistrertAdresse.value,
    søkerHarMeldtAdresseEndring.value,
    oppdaterPersonopplysninger,
  ]);

  const onSøkerBorPåRegistrertAdresse = (svar: SvarAlternativ) => {
    søkerBorPåRegistrertAdresse.handleChange(svar);

    // TODO: Dette kan muligens gjøres enklere.
    if (svar.id === 'JA') {
      søkerHarMeldtAdresseEndring.setValue(undefined);
    }
  };

  const onSøkerHarMeldtAdresseEndring = (svar: SvarAlternativ) => {
    søkerHarMeldtAdresseEndring.handleChange(svar);
  };

  const visSøkerHarMeldtAdresseEndringSpørsmål = søkerBorPåRegistrertAdresse.erNei;
  const visSøkerHarMeldtAdresseEndringAlert = søkerHarMeldtAdresseEndring.erJa;
  const visSøkerMåMeldeAdresseEndringAlert = søkerHarMeldtAdresseEndring.erNei;
  const visPapirSøknadTekst = søkerHarMeldtAdresseEndring.erNei;

  return (
    <VStack gap={'6'}>
      <JaNeiSpørsmålV2
        spørsmål={søkerBorPåReigstrertAdresseSpørsmål}
        onChange={onSøkerBorPåRegistrertAdresse}
      />

      {visSøkerHarMeldtAdresseEndringSpørsmål && (
        <VStack gap={'6'}>
          <JaNeiSpørsmålV2
            spørsmål={søkerHarMeldtAdresseEndringSpørsmål}
            onChange={onSøkerHarMeldtAdresseEndring}
          />

          {visSøkerHarMeldtAdresseEndringAlert && (
            <Alert variant={'info'} size={'small'} inline>
              <LocaleTekst tekst={'personopplysninger.alert.meldtAdresseendring'} />
            </Alert>
          )}

          {visSøkerMåMeldeAdresseEndringAlert && (
            <Alert variant={'warning'} size={'small'} inline>
              <LocaleTekst tekst={'personopplysninger.alert.riktigAdresse'} />
            </Alert>
          )}
        </VStack>
      )}

      {visPapirSøknadTekst && (
        <VStack gap={'6'}>
          <Heading size="xsmall" className={styles.heading}>
            {hentTekst('personopplysninger.info.endreAdresse', intl)}
          </Heading>
          {/*TODO: Denne må fikses, er dessverre ødelagt.*/}
          <LocaleTekst tekst={hentTekst('personopplysninger.lenke.pdfskjema', intl)} />
        </VStack>
      )}
    </VStack>
  );
};
