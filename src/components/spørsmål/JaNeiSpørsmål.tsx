import React from 'react';
import { Radio, RadioGroup, ReadMore, VStack, Box } from '@navikt/ds-react';
import clsx from 'clsx';
import styles from './JaNeiSpørsmål.module.css';
import { ESvar, ISpørsmål, ISvar } from '../../models/felles/spørsmålogsvar';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { logSpørsmålBesvart } from '../../utils/amplitude';
import { skjemanavnTilId, urlTilSkjemanavn } from '../../utils/skjemanavn';
import { hentTekst } from '../../utils/søknad';

interface Props {
  spørsmål: ISpørsmål;
  onChange: (spørsmål: ISpørsmål, svar: ISvar) => void;
  valgtSvar: boolean | undefined;
}

const JaNeiSpørsmål: React.FC<Props> = ({ spørsmål, onChange, valgtSvar }) => {
  const intl = useLokalIntlContext();
  const skjemanavn = urlTilSkjemanavn(window.location.href);
  const skjemaId = skjemanavnTilId(skjemanavn);

  const spørsmålTekst = intl.formatMessage({ id: spørsmål.tekstid });

  const getSvarVerdi = () => {
    if (valgtSvar === true) return ESvar.JA;
    if (valgtSvar === false) return ESvar.NEI;
    return '';
  };

  const handleChange = (value: string) => {
    const valgtSvar = spørsmål.svaralternativer.find((s) => s.id === value);

    if (valgtSvar) {
      logSpørsmålBesvart(
        skjemanavn,
        skjemaId,
        spørsmålTekst,
        valgtSvar.svar_tekst,
        true
      );

      onChange(spørsmål, valgtSvar);
    }
  };

  return (
    <VStack gap="4">
      <RadioGroup
        legend={spørsmålTekst}
        value={getSvarVerdi()}
        onChange={(verdi) => handleChange(verdi)}
        description={
          spørsmål.lesmer && (
            <ReadMore
              header={hentTekst(spørsmål.lesmer.headerTekstid, intl)}
              className={styles.readMore}
            >
              {hentTekst(spørsmål.lesmer.innholdTekstid, intl)}
            </ReadMore>
          )
        }
      >
        <div className={styles.radioGroup}>
          {spørsmål.svaralternativer.map((svar) => (
            <Box
              key={svar.svar_tekst}
              className={clsx(
                styles.radioBox,
                getSvarVerdi() === svar.id && styles.selected
              )}
              onClick={() => handleChange(svar.id)}
            >
              <Radio value={svar.id}>{svar.svar_tekst}</Radio>
            </Box>
          ))}
        </div>
      </RadioGroup>
    </VStack>
  );
};

export default JaNeiSpørsmål;
