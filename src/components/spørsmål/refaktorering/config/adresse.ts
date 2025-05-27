import { Question } from './question';

export const adresseQuestions: Question[] = [
  {
    id: 'personopplysninger.spm.riktigAdresse',
    textKey: 'personopplysninger.spm.riktigAdresse',
    type: 'radio',
    required: true,
    options: [
      { value: 'svar.ja', labelKey: 'svar.ja' },
      { value: 'svar.nei', labelKey: 'svar.nei' },
    ],
    optionDirection: 'horizontal',
    followUps: [
      {
        when: 'svar.ja',
        questions: [
          {
            id: 'sivilstatus.spm.erUformeltGift',
            textKey: 'sivilstatus.spm.erUformeltGift',
            readMoreTitleKey: 'sivilstatus.lesmer-åpne.erUformeltGift',
            readMoreContentKey: 'sivilstatus.lesmer-innhold.erUformeltGift',
            conditionalAlerts: {
              'svar.ja': {
                alertKey: 'sivilstatus.alert.erUformeltGift',
                variant: 'info',
              },
            },
            type: 'radio',
            required: true,
            options: [
              { value: 'svar.ja', labelKey: 'svar.ja' },
              { value: 'svar.nei', labelKey: 'svar.nei' },
            ],
            optionDirection: 'horizontal',
          },
        ],
      },
      {
        when: 'svar.nei',
        questions: [
          {
            id: 'personopplysninger.spm.meldtAdresseendring',
            textKey: 'personopplysninger.spm.meldtAdresseendring',
            conditionalAlerts: {
              'svar.ja': {
                alertKey: 'personopplysninger.alert.meldtAdresseendring',
                variant: 'info',
              },
              'svar.nei': {
                alertKey: 'personopplysninger.alert.riktigAdresse',
                variant: 'warning',
              },
            },
            type: 'radio',
            required: true,
            options: [
              { value: 'svar.ja', labelKey: 'svar.ja' },
              { value: 'svar.nei', labelKey: 'svar.nei' },
            ],
            optionDirection: 'horizontal',
          },
        ],
      },
    ],
  },
];
