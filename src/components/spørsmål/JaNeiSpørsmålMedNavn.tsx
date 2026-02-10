import React, { SyntheticEvent } from 'react';
import { ESvar, ISpørsmål, ISvar } from '../../models/felles/spørsmålogsvar';
import { RadioGroup } from '@navikt/ds-react';
import { RadioKnapp } from '../panel/RadioKnapp';
import { LesMerTekst } from '../lesmertekst/LesMerTekst';
import styles from './Spørsmål.module.css';

interface Props {
  spørsmål: ISpørsmål;
  spørsmålTekst: string;
  onChange: (spørsmål: ISpørsmål, svar: ISvar) => void;
  valgtSvar: boolean | undefined;
}

export const JaNeiSpørsmålMedNavn: React.FC<Props> = ({
  spørsmål,
  spørsmålTekst,
  onChange,
  valgtSvar,
}) => {
  const onClickHandle = (
    e: SyntheticEvent<EventTarget, Event>,
    spørsmål: ISpørsmål,
    svar: ISvar
  ): void => {
    onChange !== undefined && svar && onChange(spørsmål, svar);
  };

  const erValgtSvarRadioKnapp = (svar: ISvar, valgtSvar: boolean): boolean => {
    return (
      (svar.id === ESvar.JA && valgtSvar === true) || (svar.id === ESvar.NEI && valgtSvar === false)
    );
  };

  const svar = (): ESvar | undefined => {
    switch (valgtSvar) {
      case true:
        return ESvar.JA;
      case false:
        return ESvar.NEI;
      default:
        return undefined;
    }
  };

  return (
    <div className={`${styles.radioGruppe} ${styles.jaNei}`} key={spørsmål.søknadid}>
      <RadioGroup
        legend={spørsmålTekst}
        value={svar()}
        description={
          spørsmål.lesmer && (
            <LesMerTekst
              åpneTekstid={spørsmål.lesmer.headerTekstid}
              innholdTekstid={spørsmål.lesmer.innholdTekstid}
            />
          )
        }
      >
        {spørsmål.svaralternativer.map((svar: ISvar) => {
          const svarISøknad = valgtSvar !== undefined && erValgtSvarRadioKnapp(svar, valgtSvar);

          return (
            <RadioKnapp
              key={svar.svar_tekst}
              name={spørsmål.søknadid}
              value={svar.id}
              checked={svarISøknad ? svarISøknad : false}
              onChange={(e) => onClickHandle(e, spørsmål, svar)}
            >
              {svar.svar_tekst}
            </RadioKnapp>
          );
        })}
      </RadioGroup>
    </div>
  );
};
