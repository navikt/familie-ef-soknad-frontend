import React from 'react';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import {
  Alert,
  BodyShort,
  Box,
  Radio,
  RadioGroup,
  VStack,
} from '@navikt/ds-react';
import { hentTekst } from '../../../../../utils/søknad';
import styles from '../spørsmåltyper/SingleSelectSpørsmålKomponent.module.css';
import { SpørsmålWrapper } from '../SpørsmålWrapper';
import LocaleTekst from '../../../../../language/LocaleTekst';

export const Personopplysningerv2: React.FC = () => {
  const intl = useLokalIntlContext();

  return (
    <VStack gap="6">
      {/* Bor du på denne adressen? */}
      <SpørsmålWrapper
        tittel={hentTekst('personopplysninger.spm.riktigAdresse', intl)}
      >
        <RadioGroup
          legend={hentTekst('personopplysninger.spm.riktigAdresse', intl)}
          hideLegend={true}
          onChange={() => {}}
        >
          <div className={styles.stackHorizontal}>
            <Box className={styles.radioBox}>
              <Radio value={'Ja'}>{hentTekst('svar.ja', intl)}</Radio>
            </Box>
            <Box className={styles.radioBox}>
              <Radio value={'Nei'}>{hentTekst('svar.nei', intl)}</Radio>
            </Box>
          </div>
        </RadioGroup>
      </SpørsmålWrapper>

      {/* Er du gift uten at er registrert i folkeregisteret i Norge? */}
      <SpørsmålWrapper
        tittel={hentTekst('sivilstatus.spm.erUformeltGift', intl)}
        lesMerTittel={hentTekst('sivilstatus.lesmer-åpne.erUformeltGift', intl)}
        lesMerTekst={hentTekst(
          'sivilstatus.lesmer-innhold.erUformeltGift',
          intl
        )}
      >
        <VStack gap={'6'}>
          <RadioGroup
            legend={hentTekst('sivilstatus.spm.erUformeltGift', intl)}
            hideLegend={true}
            onChange={() => {}}
          >
            <div className={styles.stackHorizontal}>
              <Box className={styles.radioBox}>
                <Radio value={'Ja'}>{hentTekst('svar.ja', intl)}</Radio>
              </Box>
              <Box className={styles.radioBox}>
                <Radio value={'Nei'}>{hentTekst('svar.nei', intl)}</Radio>
              </Box>
            </div>
          </RadioGroup>

          {/* Skal kun vises når bruker svarer "ja" på dette spørsmålet. */}
          <Alert variant="info" inline={true}>
            {hentTekst('sivilstatus.alert.erUformeltGift', intl)}
          </Alert>
        </VStack>
      </SpørsmålWrapper>

      {/* Er du separert eller skilt uten at dette er registrert i folkeregisteret i Norge? */}
      <SpørsmålWrapper
        tittel={hentTekst('sivilstatus.spm.erUformeltSeparertEllerSkilt', intl)}
      >
        <VStack gap={'6'}>
          <RadioGroup
            legend={hentTekst(
              'sivilstatus.spm.erUformeltSeparertEllerSkilt',
              intl
            )}
            hideLegend={true}
            onChange={() => {}}
          >
            <div className={styles.stackHorizontal}>
              <Box className={styles.radioBox}>
                <Radio value={'Ja'}>{hentTekst('svar.ja', intl)}</Radio>
              </Box>
              <Box className={styles.radioBox}>
                <Radio value={'Nei'}>{hentTekst('svar.nei', intl)}</Radio>
              </Box>
            </div>
          </RadioGroup>

          {/* Skal kun vises når bruker svarer "ja" på dette spørsmålet. */}
          <Alert variant="info" inline={true}>
            {hentTekst('sivilstatus.alert.erUformeltSeparertEllerSkilt', intl)}
          </Alert>
        </VStack>
      </SpørsmålWrapper>

      {/* Har du meldt adresseendring til Folkeregisteret? */}
      <SpørsmålWrapper
        tittel={hentTekst('personopplysninger.spm.meldtAdresseendring', intl)}
      >
        <VStack gap={'6'}>
          <RadioGroup
            legend={hentTekst(
              'personopplysninger.spm.meldtAdresseendring',
              intl
            )}
            hideLegend={true}
            onChange={() => {}}
          >
            <div className={styles.stackHorizontal}>
              <Box className={styles.radioBox}>
                <Radio value={'Ja'}>{hentTekst('svar.ja', intl)}</Radio>
              </Box>
              <Box className={styles.radioBox}>
                <Radio value={'Nei'}>{hentTekst('svar.nei', intl)}</Radio>
              </Box>
            </div>
          </RadioGroup>

          {/* Skal kun vises når bruker svarer "ja" på dette spørsmålet. */}
          <Alert variant="info" inline={true}>
            {hentTekst('personopplysninger.alert.meldtAdresseendring', intl)}
          </Alert>

          {/* Skal kun vises når bruker svarer "nei" på dette spørsmålet. */}
          <Alert variant="warning">
            <LocaleTekst tekst={'personopplysninger.alert.riktigAdresse'} />
          </Alert>
        </VStack>
      </SpørsmålWrapper>

      {/* Skal du ikke endre adresse i Folkeregisteret? */}
      <SpørsmålWrapper
        tittel={hentTekst('personopplysninger.info.endreAdresse', intl)}
      >
        <BodyShort>
          <LocaleTekst tekst={'personopplysninger.lenke.pdfskjema'} />
        </BodyShort>
      </SpørsmålWrapper>
    </VStack>
  );
};
