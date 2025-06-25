import React from 'react';
import { Box, Radio, RadioGroup, VStack } from '@navikt/ds-react';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../../utils/søknad';
import { SpørsmålWrapper } from '../SpørsmålWrapper';
import styles from './PersonopplysningerV2.module.css';

export const HvorforErDuAleneMedBarn: React.FC = () => {
  const intl = useLokalIntlContext();

  return (
    <VStack gap="6">
      {/* 1. Hvorfor er du alene med barn? */}
      <SpørsmålWrapper
        tittel={hentTekst('sivilstatus.spm.begrunnelse', intl)}
        lesMerTittel={hentTekst('sivilstatus.hjelpetekst-åpne.begrunnelse', intl)}
        lesMerTekst={hentTekst('sivilstatus.hjelpetekst-innhold.begrunnelse', intl)}
      >
        <RadioGroup
          legend={hentTekst('sivilstatus.spm.begrunnelse', intl)}
          hideLegend
          onChange={() => {}}
          value={undefined}
        >
          <div className={styles.stackVertical}>
            <Box className={styles.radioBox}>
              <Radio value="samlivsbrudd-med-den-andre-forelderen">
                {hentTekst('sivilstatus.svar.samlivsbruddForeldre', intl)}
              </Radio>
            </Box>
            <Box className={styles.radioBox}>
              <Radio value="samlivsbrudd-med-noen-andre">
                {hentTekst('sivilstatus.svar.samlivsbruddAndre', intl)}
              </Radio>
            </Box>
            <Box className={styles.radioBox}>
              <Radio value="jeg-er-alene-med-barn-fra-fødsel">
                {hentTekst('sivilstatus.svar.aleneFraFødsel', intl)}
              </Radio>
            </Box>
            <Box className={styles.radioBox}>
              <Radio value="endring-i-omsorgen-for-barn">
                {hentTekst('sivilstatus.svar.endringISamværsordning', intl)}
              </Radio>
            </Box>
            <Box className={styles.radioBox}>
              <Radio value="jeg-er-alene-med-barn-på-grunn-av-dødsfall">
                {hentTekst('sivilstatus.svar.dødsfall', intl)}
              </Radio>
            </Box>
          </div>
        </RadioGroup>
      </SpørsmålWrapper>
    </VStack>
  );
};
