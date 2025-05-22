import { Question } from './question';

export const sivilstandQuestions: Question[] = [
  {
    id: 'sivilstatus.spm.erUformeltGift',
    textKey: 'sivilstatus.spm.erUformeltGift',
    descriptionKey: 'sivilstatus.lesmer-åpne.erUformeltGift',
    alertKey: 'sivilstatus.alert.erUformeltGift',
    type: 'radio',
    required: true,
    options: [
      { value: 'svar.ja', labelKey: 'svar.ja' },
      { value: 'svar.nei', labelKey: 'svar.nei' },
    ],
  },
  {
    id: 'sivilstatus.spm.erUformeltSeparertEllerSkilt',
    textKey: 'sivilstatus.spm.erUformeltSeparertEllerSkilt',
    alertKey: 'sivilstatus.alert.erUformeltSeparertEllerSkilt',
    type: 'radio',
    required: true,
    options: [
      { value: 'svar.ja', labelKey: 'svar.ja' },
      { value: 'svar.nei', labelKey: 'svar.nei' },
    ],
  },
  {
    id: 'sivilstatus.spm.begrunnelse',
    textKey: 'sivilstatus.spm.begrunnelse',
    descriptionKey: 'sivilstatus.hjelpetekst-åpne.begrunnelse',
    type: 'radio',
    required: true,
    options: [
      {
        value: 'sivilstatus.svar.aleneFraFødsel',
        labelKey: 'sivilstatus.svar.aleneFraFødsel',
      },
      {
        value: 'sivilstatus.svar.samlivsbruddForeldre',
        labelKey: 'sivilstatus.svar.samlivsbruddForeldre',
      },
      {
        value: 'sivilstatus.svar.samlivsbruddAndre',
        labelKey: 'sivilstatus.svar.samlivsbruddAndre',
      },
      {
        value: 'sivilstatus.svar.dødsfall',
        labelKey: 'sivilstatus.svar.dødsfall',
      },
      {
        value: 'sivilstatus.svar.endringISamværsordning',
        labelKey: 'sivilstatus.svar.endringISamværsordning',
      },
    ],
    followUps: [
      {
        when: [
          'sivilstatus.svar.samlivsbruddForeldre',
          'sivilstatus.svar.samlivsbruddAndre',
        ],
        questions: [
          {
            id: 'sivilstatus.datovelger.endring',
            textKey: 'sivilstatus.datovelger.endring',
            alertKey: 'sivilstatus.alert.samlivsbrudd',
            type: 'date',
            required: true,
          },
          {
            id: 'sivilstatus.datovelger.flyttetFraHverandre',
            textKey: 'sivilstatus.datovelger.flyttetFraHverandre',
            type: 'date',
            required: true,
          },
          {
            id: 'sivilstatus.tittel.samlivsbruddAndre',
            textKey: 'sivilstatus.tittel.samlivsbruddAndre',
            type: 'text',
            required: true,
          },
        ],
      },
      {
        when: 'sivilstatus.svar.dødsfall',
        questions: [
          {
            id: 'sivilstatus.alert.dødsfall',
            textKey: 'sivilstatus.alert.dødsfall',
            type: 'info',
            required: false,
          },
        ],
      },
    ],
  },
];
