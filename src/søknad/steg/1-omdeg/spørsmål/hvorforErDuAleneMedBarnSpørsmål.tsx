import { SingleSelectSpørsmål } from '../../../../components/spørsmål/komponent/nyrefaktorering/Spørsmål';

export const hvorforErDuAleneMedBarnSpørsmål: SingleSelectSpørsmål = {
  id: 'hvorforErDuAleneMedBarn',
  spørsmålTekstKey: 'sivilstatus.spm.begrunnelse',

  type: 'single-select',

  svarAlternativ: [
    {
      svarVerdi: 'samlivsbruddMedDenAndreForelderen',
      label: 'sivilstatus.svar.samlivsbruddForeldre',
    },
    {
      svarVerdi: 'samlivsbruddMedNoenAndre',
      label: 'sivilstatus.svar.samlivsbruddAndre',
    },
    {
      svarVerdi: 'jegErAleneMedBarnFraFødsel',
      label: 'sivilstatus.svar.aleneFraFødsel',
    },
    {
      svarVerdi: 'endringIOmsorgenForBarn',
      label: 'sivilstatus.svar.endringISamværsordning',
    },
    {
      svarVerdi: 'jegErAleneMedBarnPåGrunnAvDødsfall',
      label: 'sivilstatus.svar.dødsfall',
    },
  ],
  svarAlternativLayout: 'vertical',

  lesMerTittelKey: 'sivilstatus.hjelpetekst-åpne.begrunnelse',
  lesMerTekstKey: 'sivilstatus.hjelpetekst-innhold.begrunnelse',

  alerts: [
    {
      id: 'alertDødsfall',
      alertTekstKey: 'sivilstatus.alert.dødsfall',
      alertVariant: 'info',

      visAlertNår: ({ valgtSvar }) =>
        valgtSvar === 'jegErAleneMedBarnPåGrunnAvDødsfall',
    },
  ],
};
