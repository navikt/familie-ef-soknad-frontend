import React from 'react';
import { Radio, RadioGroup, Stack } from '@navikt/ds-react';
import { Question, RadioQuestion } from '../config/question';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../utils/søknad';
import styles from './RadioQuestionComponent.module.css'; // optional

interface Props {
  question: RadioQuestion;
  value?: string;
  onChange: (value: string) => void;
  renderFollowUps?: (questions: Question[]) => React.ReactNode;
}

export const RadioQuestionComponent = ({
  question,
  value,
  onChange,
  renderFollowUps,
}: Props) => {
  const intl = useLokalIntlContext();

  const followUp = question.followUps?.find((f) =>
    Array.isArray(f.when) ? f.when.includes(value || '') : f.when === value
  );

  return (
    <RadioGroup
      legend={hentTekst(question.textKey, intl)}
      value={value}
      onChange={onChange}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} gap="0 6" wrap={false}>
        {question.options.map((opt) => (
          <label key={opt.value} className={styles.radioTile}>
            <Radio value={opt.value} className={styles.radioInput}>
              <span className={styles.visuallyHidden}>
                {hentTekst(opt.labelKey, intl)}
              </span>
            </Radio>
            {hentTekst(opt.labelKey, intl)}
          </label>
        ))}
      </Stack>

      {followUp && renderFollowUps?.(followUp.questions)}
    </RadioGroup>
  );
};
