import { Question } from './question';

export const aleneMedBarnQuestion: Question = {
  id: 'sivilstatus.spm.begrunnelse',
  textKey: 'sivilstatus.spm.begrunnelse',
  type: 'radio',
  required: true,
  options: [
    {
      value: 'sivilstatus.svar.samlivsbruddForeldre',
      labelKey: 'sivilstatus.svar.samlivsbruddForeldre',
    },
    {
      value: 'sivilstatus.svar.samlivsbruddAndre',
      labelKey: 'sivilstatus.svar.samlivsbruddAndre',
    },
    {
      value: 'sivilstatus.svar.aleneFraFødsel',
      labelKey: 'sivilstatus.svar.aleneFraFødsel',
    },
    {
      value: 'sivilstatus.svar.endringISamværsordning',
      labelKey: 'sivilstatus.svar.endringISamværsordning',
    },
    {
      value: 'sivilstatus.svar.dødsfall',
      labelKey: 'sivilstatus.svar.dødsfall',
    },
  ],
  optionDirection: 'vertical',
  followUps: [],
};
