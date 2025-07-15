import React from 'react';
import { StegSpørsmål, SvarAlternativ } from '../../../../../models/felles/spørsmålogsvar';
import { Alert, Heading, VStack } from '@navikt/ds-react';
import {
  JaNeiSpørsmålV2,
  useJaNeiBoolean,
} from '../../../../../components/spørsmål/JaNeiSpørsmålV2';
import LocaleTekst from '../../../../../language/LocaleTekst';
import styles from './Adresseopplysninger.module.css';
import { hentTekst } from '../../../../../utils/søknad';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';

export const Adresseopplysninger: React.FC = () => {
  const intl = useLokalIntlContext();

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

  const onSøkerBorPåRegistrertAdresse = (svar: SvarAlternativ) => {
    søkerBorPåRegistrertAdresse.handleChange(svar);

    if (søkerBorPåRegistrertAdresse.erJa) {
      søkerHarMeldtAdresseEndring.setValue(undefined);
    }
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
            onChange={søkerHarMeldtAdresseEndring.handleChange}
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
