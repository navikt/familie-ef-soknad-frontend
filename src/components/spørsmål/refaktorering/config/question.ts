export type QuestionType =
  | 'radio'
  | 'text'
  | 'date'
  | 'country'
  | 'number'
  | 'info';

export interface Option {
  value: string;
  labelKey: string;
}

export interface BaseQuestion {
  id: string;
  textKey: string;
  descriptionKey?: string;
  alertKey?: string;
  required?: boolean;

  // Enkelte spørsmål kan være gjentagene der en kan utfylle flere ganger. Dette er typisk ting som f.eks utenlandsperioder.
  repeatable?: boolean;
  type: QuestionType;
}

export interface RadioQuestion extends BaseQuestion {
  type: 'radio';
  options: Option[];
  optionDirection: 'vertical' | 'horizontal';
  followUps?: ConditionalFollowUp[];
  readMoreTitleKey?: string;
  readMoreContentKey?: string;
  conditionalAlerts?: {
    [answerValue: string]: {
      alertKey: string;
      variant?: 'info' | 'success' | 'warning' | 'error';
    };
  };
}

export interface TextQuestion extends BaseQuestion {
  type: 'text';
  placeholderKey?: string;
}

export interface DateQuestion extends BaseQuestion {
  type: 'date';
}

export interface CountryQuestion extends BaseQuestion {
  type: 'country';
}

export interface NumberQuestion extends BaseQuestion {
  type: 'number';
}

export interface InfoBlock extends BaseQuestion {
  type: 'info';
}

export interface ConditionalFollowUp {
  when: string | string[];
  questions: Question[];
}

export type Question =
  | RadioQuestion
  | TextQuestion
  | DateQuestion
  | CountryQuestion
  | NumberQuestion
  | InfoBlock;
