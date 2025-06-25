import React from 'react';
import styled from 'styled-components';
import LesMerTekst from '../LesMerTekst';
import { IHjelpetekst } from '../../models/felles/hjelpetekst';
import { BodyShort, Label } from '@navikt/ds-react';
import { TextFieldMedBredde } from '../TextFieldMedBredde';
import LocaleTekst from '../../language/LocaleTekst';

const StyledComponent = styled.div`
  display: grid;
  grid-template-columns: min-content auto;
  grid-template-rows: repeat(3, min-content);
  grid-template-areas:
    'label label'
    'hjelpetekst hjelpetekst'
    'input tegn';

  .navds-label {
    grid-area: label;
  }

  .navds-form-field {
    grid-area: input;
  }

  .beskrivendeTekst {
    padding-left: 0.5rem;
    grid-area: tegn;
    align-self: center;
  }
`;

const HjelpetekstContainer = styled.div`
  grid-area: hjelpetekst;
  margin-bottom: 0.5rem;
`;

interface Props {
  label: string;
  utvidetTekstNøkkel?: string;
  hjelpetekst?: IHjelpetekst;
  nøkkel: string;
  type?: 'email' | 'number' | 'password' | 'tel' | 'text' | 'url';
  bredde?: 'fullbredde' | 'XXL' | 'XL' | 'L' | 'M' | 'S' | 'XS' | 'XXS';
  settInputFelt: (e: React.FormEvent<HTMLInputElement>, nøkkel: string, label: string) => void;
  beskrivendeTekst: string;
  value: string;
  feil?: React.ReactNode | boolean;
  placeholder?: string;
}

const InputLabelGruppe: React.FC<Props> = ({
  label,
  hjelpetekst,
  nøkkel,
  value,
  type,
  bredde,
  settInputFelt,
  beskrivendeTekst,
  feil,
  placeholder,
  utvidetTekstNøkkel,
}) => {
  const ignorerScrollForTallInput = (e: any) => e.target.blur();

  return (
    <StyledComponent aria-live="polite">
      <Label as={'label'} htmlFor={label}>
        {label}
      </Label>
      {hjelpetekst && (
        <HjelpetekstContainer>
          <LesMerTekst
            åpneTekstid={hjelpetekst.headerTekstid}
            innholdTekstid={hjelpetekst.innholdTekstid}
          />
        </HjelpetekstContainer>
      )}
      {utvidetTekstNøkkel && (
        <HjelpetekstContainer>
          <BodyShort as={'span'} size={'small'}>
            <LocaleTekst tekst={utvidetTekstNøkkel} />
          </BodyShort>
        </HjelpetekstContainer>
      )}
      <TextFieldMedBredde
        label={label}
        hideLabel
        aria-label={label}
        id={label}
        key={label}
        type={type}
        bredde={bredde}
        onChange={(e) => settInputFelt(e, nøkkel, label)}
        value={value}
        error={feil}
        placeholder={placeholder}
        onWheel={ignorerScrollForTallInput}
      />
      <BodyShort className={'beskrivendeTekst'}>{beskrivendeTekst}</BodyShort>
    </StyledComponent>
  );
};

export default InputLabelGruppe;
