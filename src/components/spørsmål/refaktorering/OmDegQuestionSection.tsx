import React, { useState } from 'react';
import { useLokalIntlContext } from '../../../context/LokalIntlContext';
import { Question } from './question';
import { RadioQuestionComponent } from './RadioQuestionComponent';
import { adresseQuestions } from './adresse';

export const OmDegQuestionSection: React.FC = () => {
  useLokalIntlContext();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const renderFollowUps = (questions: Question[]) => {
    return questions.map((followUp) => {
      if (followUp.type === 'radio') {
        return (
          <RadioQuestionComponent
            key={followUp.id}
            question={followUp}
            value={answers[followUp.id]}
            onChange={(value) => handleAnswer(followUp.id, value)}
            renderFollowUps={renderFollowUps}
          />
        );
      }

      return <p key={followUp.id}>🔧 Unsupported type: {followUp.type}</p>;
    });
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      {adresseQuestions.map((q) =>
        q.type === 'radio' ? (
          <RadioQuestionComponent
            key={q.id}
            question={q}
            value={answers[q.id]}
            onChange={(value) => handleAnswer(q.id, value)}
            renderFollowUps={renderFollowUps}
          />
        ) : (
          <p key={q.id}>🔧 Unsupported type: {q.type}</p>
        )
      )}
    </div>
  );
};
