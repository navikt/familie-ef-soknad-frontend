import React from 'react';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { Box, Radio, RadioGroup, VStack } from '@navikt/ds-react';
import { hentTekst } from '../../../../../utils/søknad';
import styles from '../spørsmåltyper/SingleSelectSpørsmålKomponent.module.css';
import { SpørsmålWrapper } from '../SpørsmålWrapper';

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
      </SpørsmålWrapper>
    </VStack>
  );
};
