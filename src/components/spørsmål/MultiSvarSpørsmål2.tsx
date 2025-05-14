import React, { FC } from 'react';
import styled from 'styled-components';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { RadioGroup } from '@navikt/ds-react';
import { Bo3, DelerBoligMedAndreVoksne } from '../../models/steg/bosituasjon';
import RadioPanelCustom2 from '../panel/RadioPanel2';

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
  spørsmål: string;
  alternativer: string[];
  bosituasjon2: Bo3;
  settBosituasjon: (svar: Bo3) => void;
  valgtSvar: DelerBoligMedAndreVoksne;
}

const MultiSvarSpørsmål2: FC<Props> = ({
  // className,
  spørsmål,
  alternativer,
  bosituasjon2,
  valgtSvar,
}) => {
  const intl = useLokalIntlContext();

  const legend = intl.formatMessage({ id: spørsmål });

  return (
    <StyledMultisvarSpørsmål key={spørsmål}>
      <RadioGroup legend={legend} value={valgtSvar}>
        {alternativer.map((alternativ) => {
          const svarISøknad = alternativ === valgtSvar;
          return (
            <RadioPanelCustom2
              key={alternativ}
              value={bosituasjon2.hovedSpørsmål}
              onChange={(e) => {
                console.log(e.target.value);
                console.log(bosituasjon2.hovedSpørsmål);
                // settBosituasjon;
                // ({ hovedSpørsmål: e.target.value as DelerBoligMedAndreVoksne });
              }}
              checked={svarISøknad ? svarISøknad : false}
            >
              {alternativ}
            </RadioPanelCustom2>
          );
          // const svarISøknad = alternativ === valgtSvar;
          // return (
          //   <RadioPanel2
          //     className={className}
          //     key={alternativ}
          //     value={}
          //     checked={svarISøknad ? svarISøknad : false}
          //   >
          //     {svar.svar_tekst}
          //   </RadioPanel2>
          // );
        })}
      </RadioGroup>
    </StyledMultisvarSpørsmål>
  );
};

export default MultiSvarSpørsmål2;
