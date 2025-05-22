import React from 'react';
import { Radio, RadioGroup } from '@navikt/ds-react';
import { Alert, ReadMore } from '@navikt/ds-react';
import styles from './RadioQuestionComponent.module.css';
import { Question, RadioQuestion } from './question';
import { useLokalIntlContext } from '../../../context/LokalIntlContext';
import { hentTekst } from '../../../utils/søknad';

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

  const selectedFollowUps = question.followUps?.find((fu) =>
    Array.isArray(fu.when) ? fu.when.includes(value || '') : fu.when === value
  )?.questions;

  return (
    <div className={styles.questionBlock}>
      <RadioGroup
        legend={hentTekst(question.textKey, intl)}
        value={value}
        onChange={(v: string) => onChange(v)}
      >
        {question.options.map((opt) => (
          <Radio key={opt.value} value={opt.value} className={styles.radioTile}>
            {hentTekst(opt.labelKey, intl)}
          </Radio>
        ))}
      </RadioGroup>

      {question.descriptionKey && (
        <ReadMore
          className={styles.description}
          header={hentTekst(`${question.descriptionKey}`, intl)}
        >
          {hentTekst(`${question.descriptionKey}.innhold`, intl)}
        </ReadMore>
      )}

      {question.alertKey && value === 'svar.nei' && (
        <Alert variant="info" className={styles.alert}>
          {hentTekst(question.alertKey, intl)}
        </Alert>
      )}

      {selectedFollowUps && renderFollowUps?.(selectedFollowUps)}
    </div>
  );
};
