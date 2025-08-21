import React, { FC } from 'react';
import { ISpørsmål, ISvar } from '../../models/felles/spørsmålogsvar';
import LesMerTekst from '../LesMerTekst';
import styled from 'styled-components';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { RadioGroup } from '@navikt/ds-react';
import RadioPanelCustom from '../panel/RadioPanel';
import { hentTekst } from '../../utils/teksthåndtering';

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

  .toKorteSvar .navds-radio-buttons {
    grid-template-columns: 1fr 1fr;

    @media all and (max-width: 420px) {
      grid-template-columns: 1fr;
    }
  }
`;

interface Props {
  className?: string;
  spørsmål: ISpørsmål;
  settSpørsmålOgSvar: (spørsmål: ISpørsmål, svar: ISvar) => void;
  valgtSvar: string | undefined;
}

const MultiSvarSpørsmål: FC<Props> = ({ className, spørsmål, settSpørsmålOgSvar, valgtSvar }) => {
  const intl = useLokalIntlContext();

  const legend = hentTekst(spørsmål.tekstid, intl);

  return (
    <StyledMultisvarSpørsmål key={spørsmål.søknadid}>
      <RadioGroup
        legend={legend}
        value={valgtSvar}
        description={
          spørsmål.lesmer && (
            <LesMerTekst
              åpneTekstid={spørsmål.lesmer ? spørsmål.lesmer.headerTekstid : ''}
              innholdTekstid={spørsmål.lesmer ? spørsmål!.lesmer!.innholdTekstid : ''}
            />
          )
        }
      >
        {spørsmål.svaralternativer.map((svar: ISvar) => {
          const svarISøknad = svar.svar_tekst === valgtSvar;
          return (
            <RadioPanelCustom
              className={className}
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

export default MultiSvarSpørsmål;
