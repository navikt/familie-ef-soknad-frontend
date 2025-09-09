import React, { PropsWithChildren } from 'react';
import { Radio } from '@navikt/ds-react';
import styles from './RadioPanel.module.css';

interface Properties extends React.InputHTMLAttributes<HTMLInputElement> {
  name?: string | undefined;
  value?: string | readonly string[] | number | undefined;
  checked?: boolean | undefined;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
}

export const RadioPanelCustom: React.FC<Properties> = ({
  name,
  value,
  checked,
  onChange,
  children,
}: PropsWithChildren<Properties>) => {
  return (
    <Radio
      value={value}
      name={name}
      checked={checked}
      onChange={onChange}
      className={checked ? `${styles.radioPanel} ${styles.active}` : styles.radioPanel}
    >
      {children}
    </Radio>
  );
};
