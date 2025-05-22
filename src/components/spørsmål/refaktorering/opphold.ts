import { Question } from './question';

export const oppholdQuestions: Question[] = [
  {
    id: 'medlemskap.spm.opphold',
    textKey: 'medlemskap.spm.opphold',
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
            id: 'medlemskap.datovelger.oppholdDato',
            textKey: 'medlemskap.datovelger.oppholdDato',
            type: 'date',
            required: true,
          },
        ],
      },
    ],
  },
  {
    id: 'medlemskap.spm.bosatt',
    textKey: 'medlemskap.spm.bosatt',
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
            id: 'medlemskap.spm.oppholdsland',
            textKey: 'medlemskap.spm.oppholdsland',
            type: 'country',
            required: true,
          },
          {
            id: 'medlemskap.periodeBoddIUtlandet',
            textKey: 'medlemskap.periodeBoddIUtlandet',
            type: 'date',
            required: true,
          },
          {
            id: 'medlemskap.periodeBoddIUtlandet.slutt',
            textKey: 'medlemskap.periodeBoddIUtlandet.slutt',
            type: 'date',
            required: true,
          },
          {
            id: 'medlemskap.periodeBoddIUtlandet.begrunnelse',
            textKey: 'medlemskap.periodeBoddIUtlandet.begrunnelse',
            type: 'text',
            required: true,
          },
          {
            id: 'medlemskap.periodeBoddIUtlandet.flereutenlandsopphold',
            textKey: 'medlemskap.periodeBoddIUtlandet.flereutenlandsopphold',
            type: 'radio',
            required: true,
            options: [
              { value: 'svar.ja', labelKey: 'svar.ja' },
              { value: 'svar.nei', labelKey: 'svar.nei' },
            ],
            repeatable: true,
          },
        ],
      },
    ],
  },
];
