import React, { FC } from 'react';
import { ISpørsmål, ISvar } from '../../models/felles/spørsmålogsvar';
import styled from 'styled-components';
import { RadioGroup } from '@navikt/ds-react';
import RadioPanelCustom from '../panel/RadioPanel';
import { LesMerTekst } from '../lesmertekst/LesMerTekst';

const StyledMultisvarSpørsmål = styled.div`
  .navds-fieldset .navds-radio-buttons {
    margin-top: 0;
  }
  .navds-radio-buttons {
    display: grid;
    grid-template-columns: 1fr;
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
    <StyledMultisvarSpørsmål key={spørsmål.søknadid}>
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
            <RadioPanelCustom
              key={svar.svar_tekst}
              name={spørsmål.søknadid}
              value={svar.svar_tekst}
              checked={svarISøknad ? svarISøknad : false}
              onChange={() => {
                settSpørsmålOgSvar(spørsmål, svar);
              }}
            >
              {svar.svar_tekst}
            </RadioPanelCustom>
          );
        })}
      </RadioGroup>
    </StyledMultisvarSpørsmål>
  );
};

export default MultiSvarSpørsmålMedNavn;
