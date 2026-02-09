import React, { SyntheticEvent } from 'react';
import { ESvar, ISpørsmål, ISvar } from '../../models/felles/spørsmålogsvar';
import styled from 'styled-components';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { RadioKnapp } from '../panel/RadioKnapp';
import { RadioGroup } from '@navikt/ds-react';
import { hentTekst } from '../../utils/teksthåndtering';
import { LesMerTekst } from '../lesmertekst/LesMerTekst';

const StyledJaNeiSpørsmål = styled.div`
  .aksel-fieldset .aksel-radio-buttons {
    margin-top: 0;
  }
  .aksel-radio-buttons {
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
  onChange: (spørsmål: ISpørsmål, svar: ISvar) => void;
  valgtSvar: boolean | undefined;
}

const JaNeiSpørsmål: React.FC<Props> = ({ spørsmål, onChange, valgtSvar }) => {
  const intl = useLokalIntlContext();

  const spørsmålTekst: string = hentTekst(spørsmål.tekstid, intl);

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

  const svar = (): ESvar | null => {
    switch (valgtSvar) {
      case true:
        return ESvar.JA;
      case false:
        return ESvar.NEI;
      default:
        return null;
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
            <RadioKnapp
              key={svar.svar_tekst}
              name={spørsmål.søknadid}
              value={svar.id}
              checked={svarISøknad ? svarISøknad : false}
              onChange={(e) => {
                onClickHandle(e, spørsmål, svar);
              }}
            >
              {svar.svar_tekst}
            </RadioKnapp>
          );
        })}
      </RadioGroup>
    </StyledJaNeiSpørsmål>
  );
};

export default JaNeiSpørsmål;
