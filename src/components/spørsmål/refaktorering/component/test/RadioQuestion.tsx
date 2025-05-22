import React from 'react';
import { VStack, Heading, Box, Radio, RadioGroup } from '@navikt/ds-react';
import styles from './RadioQuestion.module.css';
import clsx from 'clsx';

type Option = {
  label: string;
  value: string;
};

interface Props {
  question: string;
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  direction: 'vertical' | 'horizontal';
}

export const RadioQuestion: React.FC<Props> = ({
  question,
  options,
  value,
  onChange,
  direction,
}) => {
  return (
    <VStack gap="4">
      <Heading size="xsmall" className={styles.heading}>
        {question}
      </Heading>

      <RadioGroup
        legend=""
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <div
          className={clsx({
            [styles.stackHorizontal]: direction === 'horizontal',
            [styles.stackVertical]: direction === 'vertical',
          })}
        >
          {options.map((opt) => (
            <Box
              key={opt.value}
              className={clsx(
                styles.radioBox,
                value === opt.value && styles.selected
              )}
              onClick={() => onChange(opt.value)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onChange(opt.value);
                }
              }}
            >
              <Radio value={opt.value}>{opt.label}</Radio>
            </Box>
          ))}
        </div>
      </RadioGroup>
    </VStack>
  );
};
