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
              'svar.ja': 'sivilstatus.alert.erUformeltGift',
            },
            type: 'radio',
            required: true,
            options: [
              { value: 'svar.ja', labelKey: 'svar.ja' },
              { value: 'svar.nei', labelKey: 'svar.nei' },
            ],
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
              'svar.ja': 'personopplysninger.alert.meldtAdresseendring',
              'svar.nei': 'personopplysninger.alert.riktigAdresse',
            },
            type: 'radio',
            required: true,
            options: [
              { value: 'svar.ja', labelKey: 'svar.ja' },
              { value: 'svar.nei', labelKey: 'svar.nei' },
            ],
          },
        ],
      },
    ],
  },
];
