import React, { useState } from 'react';
import { VStack } from '@navikt/ds-react';
import { adresseQuestions } from '../config/adresse';
import { Question } from '../config/question';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { getVisibleQuestions } from '../utils/getVisibleQuestions';
import { OmDegQuestionRenderer } from './OmDegQuestionRenderer';

export const OmDegQuestionSection: React.FC = () => {
  useLokalIntlContext();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswer = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const visibleQuestions: Question[] = getVisibleQuestions(
    adresseQuestions,
    answers
  );

  return (
    <VStack gap="8">
      {visibleQuestions.map((q) => (
        <OmDegQuestionRenderer
          key={q.id}
          question={q}
          value={answers[q.id]}
          onChange={(val) => handleAnswer(q.id, val)}
        />
      ))}
    </VStack>
  );
};
