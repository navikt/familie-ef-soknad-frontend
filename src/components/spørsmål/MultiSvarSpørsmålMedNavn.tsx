import React, { FC } from 'react';
import { ISpørsmål, ISvar } from '../../models/felles/spørsmålogsvar';
import { RadioGroup } from '@navikt/ds-react';
import { RadioKnapp } from '../panel/RadioKnapp';
import { LesMerTekst } from '../lesmertekst/LesMerTekst';
import styles from './Spørsmål.module.css';

interface Props {
  spørsmål: ISpørsmål;
  spørsmålTekst: string;
  settSpørsmålOgSvar: (spørsmål: ISpørsmål, svar: ISvar) => void;
  valgtSvar: string | undefined;
}

const MultiSvarSpørsmålMedNavn: FC<Props> = ({
  spørsmål,
  spørsmålTekst,
  settSpørsmålOgSvar,
  valgtSvar,
}) => {
  return (
    <div className={`${styles.radioGruppe} ${styles.multiSvar}`} key={spørsmål.søknadid}>
      <RadioGroup
        legend={spørsmålTekst}
        value={valgtSvar}
        description={
          spørsmål.lesmer && (
            <LesMerTekst
              åpneTekstid={spørsmål.lesmer ? spørsmål.lesmer.headerTekstid : ''}
              innholdTekstid={spørsmål.lesmer ? spørsmål.lesmer.innholdTekstid : ''}
            />
          )
        }
      >
        {spørsmål.svaralternativer.map((svar: ISvar) => {
          const svarISøknad = svar.svar_tekst === valgtSvar;
          return (
            <RadioKnapp
              key={svar.svar_tekst}
              name={spørsmål.søknadid}
              value={svar.svar_tekst}
              checked={svarISøknad ? svarISøknad : false}
              onChange={() => {
                settSpørsmålOgSvar(spørsmål, svar);
              }}
            >
              {svar.svar_tekst}
            </RadioKnapp>
          );
        })}
      </RadioGroup>
    </div>
  );
};

export default MultiSvarSpørsmålMedNavn;
