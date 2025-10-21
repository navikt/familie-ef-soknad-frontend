import React, { PropsWithChildren } from 'react';
import { Radio } from '@navikt/ds-react';
import styles from './Radiopanel.module.css';

interface Properties extends React.InputHTMLAttributes<HTMLInputElement> {
  name?: string | undefined;
  value?: string | readonly string[] | number | undefined;
  checked?: boolean | undefined;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
}

export const RadioKnapp: React.FC<Properties> = ({
  name,
  value,
  checked,
  onChange,
  children,
}: PropsWithChildren<Properties>) => {
  const classNames = [styles.radioPanel, checked ? styles.active : ''].join(' ');

  return (
    <Radio value={value} name={name} checked={checked} onChange={onChange} className={classNames}>
      {children}
    </Radio>
  );
};
