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

interface Properties extends React.InputHTMLAttributes<HTMLInputElement> {
  name?: string | undefined;
  value?: string | readonly string[] | number | undefined;
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

const RadioPanelCustom: React.FC<Properties> = ({
  name,
  value,
  checked,
  onChange,
  children,
}: PropsWithChildren<Properties>) => {
  return (
    <StyledRadio
      value={value}
      name={name}
      checked={checked}
      onChange={onChange}
      className={checked ? 'radio-panel active' : 'radio-panel non-active'}
    >
      {children}
    </StyledRadio>
  );
};
export default RadioPanelCustom;
