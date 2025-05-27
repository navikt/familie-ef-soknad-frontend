import React from 'react';
import {
  VStack,
  Heading,
  Box,
  Radio,
  RadioGroup,
  ReadMore,
  Alert,
} from '@navikt/ds-react';
import styles from './RadioQuestion.module.css';
import clsx from 'clsx';
import { Question, RadioQuestion } from '../config/question';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../utils/søknad';

interface Props {
  question: RadioQuestion;
  value?: string;
  onChange: (value: string) => void;
  direction: 'vertical' | 'horizontal';
  renderFollowUps?: (questions: Question[]) => React.ReactNode;
}

export const RadioQuestionComponent: React.FC<Props> = ({
  question,
  value,
  onChange,
  renderFollowUps,
  direction,
}) => {
  const intl = useLokalIntlContext();

  const conditionalAlert = question.conditionalAlerts?.[value || ''];
  const alertKeyToShow = question.alertKey || conditionalAlert?.alertKey;
  const alertVariant = conditionalAlert?.variant || 'info';

  const followUp = question.followUps?.find((f) =>
    Array.isArray(f.when) ? f.when.includes(value || '') : f.when === value
  );

  return (
    <VStack gap="4">
      <Heading size="xsmall" className={styles.heading}>
        {hentTekst(question.textKey, intl)}
      </Heading>

      {question.readMoreTitleKey && question.readMoreContentKey && (
        <ReadMore
          header={hentTekst(question.readMoreTitleKey, intl)}
          className={styles.readMore}
        >
          {hentTekst(question.readMoreContentKey, intl)}
        </ReadMore>
      )}

      <RadioGroup legend="" value={value} onChange={onChange}>
        <div
          className={clsx({
            [styles.stackHorizontal]: direction === 'horizontal',
            [styles.stackVertical]: direction === 'vertical',
          })}
        >
          {question.options.map((opt) => (
            <Box
              key={opt.value}
              className={clsx(
                styles.radioBox,
                value === opt.value && styles.selected
              )}
              onClick={() => onChange(opt.value)}
            >
              <Radio value={opt.value}>{hentTekst(opt.labelKey, intl)}</Radio>
            </Box>
          ))}
        </div>

        {followUp && renderFollowUps?.(followUp.questions)}
      </RadioGroup>

      {alertKeyToShow && (
        <Alert size="small" variant={alertVariant}>
          {hentTekst(alertKeyToShow, intl)}
        </Alert>
      )}
    </VStack>
  );
};
