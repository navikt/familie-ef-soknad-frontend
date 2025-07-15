import React, { useState } from 'react';
import { StegSpørsmål, SvarAlternativ } from '../../../../../models/felles/spørsmålogsvar';
import { Alert, Heading, VStack } from '@navikt/ds-react';
import { JaNeiSpørsmålV2 } from '../../../../../components/spørsmål/JaNeiSpørsmålV2';
import LocaleTekst from '../../../../../language/LocaleTekst';
import styles from '../../../../../components/spørsmål/JaNeiSpørsmålV2.module.css';
import { hentTekst } from '../../../../../utils/søknad';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';

export const Adresseopplysninger: React.FC = () => {
  const intl = useLokalIntlContext();

  const søkerBorPåReigstrertAdresseSpørsmål: StegSpørsmål = {
    id: 'søkerBorPåRegistretAdresse',
    spørsmålKey: 'personopplysninger.spm.riktigAdresse',
  };

  const søkerHarMeldtAdresseEndringSpørsmål: StegSpørsmål = {
    id: 'søkerHarMeldtAdresseEndring',
    spørsmålKey: 'personopplysninger.spm.meldtAdresseendring',
  };

  const [søkerBorPåRegistrertAdresse, settSøkerBorPåRegistrertAdresse] = useState<
    SvarAlternativ | undefined
  >();
  const [søkerHarMeldtAdresseEndring, settSøkerHarMeldtAdresseEndring] = useState<
    SvarAlternativ | undefined
  >();

  const visSøkerHarMeldtAdresseEndringSpørsmål = søkerBorPåRegistrertAdresse?.id === 'NEI';
  const visSøkerMåMeldeAdresseEndringAlert = søkerHarMeldtAdresseEndring?.id === 'NEI';
  const visPapirSøknadTekst = søkerHarMeldtAdresseEndring?.id === 'NEI';

  const handleSøkerBorPåRegistrertAdresse = (svar: SvarAlternativ) => {
    settSøkerBorPåRegistrertAdresse(svar);
    if (svar.id === 'JA') {
      settSøkerHarMeldtAdresseEndring(undefined);
    }
  };

  const handlesøkerHarMeldtAdresseEndring = (svar: SvarAlternativ) => {
    settSøkerHarMeldtAdresseEndring(svar);
  };

  return (
    <VStack gap={'6'}>
      <JaNeiSpørsmålV2
        spørsmål={søkerBorPåReigstrertAdresseSpørsmål}
        onChange={handleSøkerBorPåRegistrertAdresse}
      />

      {visSøkerHarMeldtAdresseEndringSpørsmål && (
        <VStack gap={'6'}>
          <JaNeiSpørsmålV2
            spørsmål={søkerHarMeldtAdresseEndringSpørsmål}
            onChange={handlesøkerHarMeldtAdresseEndring}
          />
          {visSøkerMåMeldeAdresseEndringAlert && (
            <Alert variant={'warning'} size={'small'} inline>
              <LocaleTekst tekst={'personopplysninger.alert.meldtAdresseendring'} />
            </Alert>
          )}
        </VStack>
      )}

      {visPapirSøknadTekst && (
        <VStack gap={'6'}>
          <Heading size="xsmall" className={styles.heading}>
            {hentTekst('personopplysninger.info.endreAdresse', intl)}
          </Heading>
          <LocaleTekst tekst={hentTekst('personopplysninger.lenke.pdfskjema', intl)} />
        </VStack>
      )}
    </VStack>
  );
};
