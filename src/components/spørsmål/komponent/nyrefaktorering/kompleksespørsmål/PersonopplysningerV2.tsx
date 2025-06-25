import React, { useState } from 'react';
import { Alert, BodyShort, Box, Radio, RadioGroup, VStack } from '@navikt/ds-react';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../../utils/søknad';
import LocaleTekst from '../../../../../language/LocaleTekst';
import { SpørsmålWrapper } from '../SpørsmålWrapper';
import styles from './PersonopplysningerV2.module.css';

export const PersonopplysningerV2: React.FC = () => {
  const intl = useLokalIntlContext();

  const [borPåAdresse, settBorPåAdresse] = useState<string>();
  const [meldtAdresseendring, settMeldtAdresseendring] = useState<string>();
  const [erUformeltGift, settErUformeltGift] = useState<string>();
  const [erUformeltSeparert, settErUformeltSeparert] = useState<string>();

  const skalViseMeldtAdresseendring = borPåAdresse === 'nei';
  const skalViseErUformeltGift = borPåAdresse === 'ja' || meldtAdresseendring === 'ja';
  const skalViseEndreAdresse = meldtAdresseendring === 'nei';
  const skalViseErSeparert = erUformeltGift !== undefined;

  return (
    <VStack gap="6">
      {/* 1. Bor du på denne adressen? */}
      <SpørsmålWrapper tittel={hentTekst('personopplysninger.spm.riktigAdresse', intl)}>
        <RadioGroup
          legend={hentTekst('personopplysninger.spm.riktigAdresse', intl)}
          hideLegend
          onChange={settBorPåAdresse}
          value={borPåAdresse}
        >
          {/* TODO: Gå gjennom implementasjo av knapp som er hel-klikkbar. */}
          <div className={styles.stackHorizontal}>
            {['ja', 'nei'].map((verdi) => (
              <Box
                key={verdi}
                className={`${styles.radioBox} ${borPåAdresse === verdi ? styles.selected : ''}`}
                onClick={() => settBorPåAdresse(verdi)}
                role="radio"
                aria-checked={borPåAdresse === verdi}
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    settBorPåAdresse(verdi);
                  }
                }}
              >
                <Radio value={verdi}>{hentTekst(`svar.${verdi}`, intl)}</Radio>
              </Box>
            ))}
          </div>
        </RadioGroup>
      </SpørsmålWrapper>

      {/* 2. Har du meldt adresseendring til Folkeregisteret? */}
      {skalViseMeldtAdresseendring && (
        <SpørsmålWrapper tittel={hentTekst('personopplysninger.spm.meldtAdresseendring', intl)}>
          <RadioGroup
            legend={hentTekst('personopplysninger.spm.meldtAdresseendring', intl)}
            hideLegend
            onChange={settMeldtAdresseendring}
            value={meldtAdresseendring}
          >
            <div className={styles.stackHorizontal}>
              <Box className={styles.radioBox}>
                <Radio value="ja">{hentTekst('svar.ja', intl)}</Radio>
              </Box>
              <Box className={styles.radioBox}>
                <Radio value="nei">{hentTekst('svar.nei', intl)}</Radio>
              </Box>
            </div>
          </RadioGroup>

          {meldtAdresseendring === 'ja' && (
            <Alert variant="info" inline>
              {hentTekst('personopplysninger.alert.meldtAdresseendring', intl)}
            </Alert>
          )}

          {meldtAdresseendring === 'nei' && (
            <Alert variant="warning">
              <LocaleTekst tekst="personopplysninger.alert.riktigAdresse" />
            </Alert>
          )}
        </SpørsmålWrapper>
      )}

      {/* 3. Skal du ikke endre adresse i Folkeregisteret? */}
      {skalViseEndreAdresse && (
        <SpørsmålWrapper tittel={hentTekst('personopplysninger.info.endreAdresse', intl)}>
          <BodyShort>
            <LocaleTekst tekst="personopplysninger.lenke.pdfskjema" />
          </BodyShort>
        </SpørsmålWrapper>
      )}

      {/* 4. Er du gift uten at det er registrert i folkeregisteret i Norge? */}
      {skalViseErUformeltGift && (
        <SpørsmålWrapper
          tittel={hentTekst('sivilstatus.spm.erUformeltGift', intl)}
          lesMerTittel={hentTekst('sivilstatus.lesmer-åpne.erUformeltGift', intl)}
          lesMerTekst={hentTekst('sivilstatus.lesmer-innhold.erUformeltGift', intl)}
        >
          <RadioGroup
            legend={hentTekst('sivilstatus.spm.erUformeltGift', intl)}
            hideLegend
            onChange={settErUformeltGift}
            value={erUformeltGift}
          >
            <div className={styles.stackHorizontal}>
              <Box className={styles.radioBox}>
                <Radio value="ja">{hentTekst('svar.ja', intl)}</Radio>
              </Box>
              <Box className={styles.radioBox}>
                <Radio value="nei">{hentTekst('svar.nei', intl)}</Radio>
              </Box>
            </div>
          </RadioGroup>

          {erUformeltGift === 'ja' && (
            <Alert variant="info" inline>
              {hentTekst('sivilstatus.alert.erUformeltGift', intl)}
            </Alert>
          )}
        </SpørsmålWrapper>
      )}

      {/* 5. Er du separert eller skilt uten at det er registrert i Norge? */}
      {skalViseErSeparert && (
        <SpørsmålWrapper tittel={hentTekst('sivilstatus.spm.erUformeltSeparertEllerSkilt', intl)}>
          <RadioGroup
            legend={hentTekst('sivilstatus.spm.erUformeltSeparertEllerSkilt', intl)}
            hideLegend
            onChange={settErUformeltSeparert}
            value={erUformeltSeparert}
          >
            <div className={styles.stackHorizontal}>
              <Box className={styles.radioBox}>
                <Radio value="ja">{hentTekst('svar.ja', intl)}</Radio>
              </Box>
              <Box className={styles.radioBox}>
                <Radio value="nei">{hentTekst('svar.nei', intl)}</Radio>
              </Box>
            </div>
          </RadioGroup>

          {erUformeltSeparert === 'ja' && (
            <Alert variant="info" inline>
              {hentTekst('sivilstatus.alert.erUformeltSeparertEllerSkilt', intl)}
            </Alert>
          )}
        </SpørsmålWrapper>
      )}
    </VStack>
  );
};
