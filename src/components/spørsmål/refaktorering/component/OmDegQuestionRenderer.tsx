import React from 'react';
import { Question } from '../config/question';
import { RadioQuestionComponent } from './RadioQuestionComponent';

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
        <RadioQuestionComponent
          question={question}
          value={value}
          onChange={onChange}
        />
      );
    default:
      return <p key={question.id}>🔧 Unsupported type: {question.type}</p>;
  }
};
