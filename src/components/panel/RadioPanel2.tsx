import React, { PropsWithChildren } from 'react';
import { Radio } from '@navikt/ds-react';
import styled from 'styled-components';
import {
  ABlue100,
  ABlue500,
  ABorderActionSelected,
  ABorderDefault,
  AShadowMedium,
} from '@navikt/ds-tokens/dist/tokens';
import { DelerBoligMedAndreVoksne } from '../../models/steg/bosituasjon';

interface Properties extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: DelerBoligMedAndreVoksne;
  checked?: boolean | undefined;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
}

const StyledRadio = styled(Radio)`
  &.radio-panel {
    width: 100%;
    background-color: #fff;
    border: 1px solid ${ABorderDefault};
    border-radius: 0.25rem;
    display: block;
    position: relative;
    font-family: 'Source Sans Pro', Arial, sans-serif;
    font-size: 1rem;
    line-height: 1.375rem;
    font-weight: 400;

    &.active {
      background-color: ${ABlue100};
      border: 1px solid transparent;
    }

    &:hover {
      border: 1px solid ${ABlue500};
      box-shadow: ${AShadowMedium};
      cursor: pointer;
    }

    &:focus-visible {
      outline: ${ABorderActionSelected} solid 1px;
    }

    .navds-radio__label {
      outline: none;
      padding: var(--a-spacing-4);
    }
  }
`;

const RadioPanelCustom2: React.FC<Properties> = ({
  value,
  checked,
  onChange,
  children,
}: PropsWithChildren<Properties>) => {
  return (
    <StyledRadio
      value={value}
      checked={checked}
      onChange={onChange}
      className={checked ? 'radio-panel active' : 'radio-panel non-active'}
    >
      {children}
    </StyledRadio>
  );
};
export default RadioPanelCustom2;
