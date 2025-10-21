import React, { SyntheticEvent } from 'react';
import { ESvar, ISpørsmål, ISvar } from '../../models/felles/spørsmålogsvar';
import styled from 'styled-components';
import { RadioGroup } from '@navikt/ds-react';
import RadioPanelCustom from '../panel/RadioPanel';
import { LesMerTekst } from '../lesmertekst/LesMerTekst';

const StyledJaNeiSpørsmål = styled.div`
  .navds-fieldset .navds-radio-buttons {
    margin-top: 0;
  }
  .navds-radio-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: min-content;
    grid-gap: 1rem;
    padding-top: 1rem;

    @media all and (max-width: 420px) {
      grid-template-columns: 1fr;
    }
  }
`;

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
    <StyledJaNeiSpørsmål key={spørsmål.søknadid}>
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
            <RadioPanelCustom
              key={svar.svar_tekst}
              name={spørsmål.søknadid}
              value={svar.id}
              checked={svarISøknad ? svarISøknad : false}
              onChange={(e) => onClickHandle(e, spørsmål, svar)}
            >
              {svar.svar_tekst}
            </RadioPanelCustom>
          );
        })}
      </RadioGroup>
    </StyledJaNeiSpørsmål>
  );
};
