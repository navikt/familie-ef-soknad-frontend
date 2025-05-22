import { Question, RadioQuestion } from '../config/question';

export function getVisibleQuestions(
  rootQuestions: Question[],
  answers: Record<string, string>
): Question[] {
  const visible: Question[] = [];

  const walk = (questions: Question[]) => {
    for (const q of questions) {
      visible.push(q);

      if (q.type === 'radio') {
        const selected = answers[q.id];
        const match = (q as RadioQuestion).followUps?.find((f) =>
          Array.isArray(f.when)
            ? f.when.includes(selected)
            : f.when === selected
        );
        if (match) {
          walk(match.questions);
        }
      }
    }
  };

  walk(rootQuestions);
  return visible;
}
