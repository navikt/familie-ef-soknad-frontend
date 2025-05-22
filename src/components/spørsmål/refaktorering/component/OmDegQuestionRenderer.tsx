import React from 'react';
import { Question } from '../config/question';
import { RadioQuestionComp } from './RadioQuestionComp';

interface Props {
  question: Question;
  value?: string;
  onChange: (val: string) => void;
}

export const OmDegQuestionRenderer: React.FC<Props> = ({
  question,
  value,
  onChange,
}) => {
  switch (question.type) {
    case 'radio':
      return (
        <RadioQuestionComp
          question={question}
          value={value}
          onChange={onChange}
          direction={'horizontal'}
        />
      );
    default:
      return <p key={question.id}>🔧 Unsupported type: {question.type}</p>;
  }
};
