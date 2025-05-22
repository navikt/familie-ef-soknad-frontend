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
        when: 'svar.nei',
        questions: [
          {
            id: 'personopplysninger.spm.meldtAdresseendring',
            textKey: 'personopplysninger.spm.meldtAdresseendring',
            alertKey: 'personopplysninger.alert.meldtAdresseendring',
            type: 'radio',
            required: true,
            options: [
              { value: 'svar.ja', labelKey: 'svar.ja' },
              { value: 'svar.nei', labelKey: 'svar.nei' },
            ],
            followUps: [
              {
                when: 'svar.nei',
                questions: [
                  {
                    id: 'personopplysninger.info.endreAdresse',
                    textKey: 'personopplysninger.info.endreAdresse',
                    alertKey: 'personopplysninger.lenke.pdfskjema',
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
        ],
      },
    ],
  },
];
