import { SingleSelectSpørsmål } from '../../../../components/spørsmål/komponent/nyrefaktorering/Spørsmål';

export const harDuMeldtAdresseendringTilFolkeregisteretSpørsmål: SingleSelectSpørsmål =
  {
    id: 'harDuMeldtAdresseendringTilFolkeregisteret',
    spørsmålTekstKey: 'personopplysninger.spm.meldtAdresseendring',

    type: 'single-select',

    alerts: [
      {
        id: 'alertMeldtAdresseEndring',
        alertTekstKey: 'personopplysninger.alert.meldtAdresseendring',
        alertVariant: 'info',

        visAlertNår: ({ valgtSvar }) => valgtSvar === 'Ja',
      },
      {
        id: 'alertRiktigAdresse',
        alertTekstKey: 'personopplysninger.alert.riktigAdresse',
        alertVariant: 'warning',

        visAlertNår: ({ valgtSvar }) => valgtSvar === 'Nei',
      },
    ],

    svarAlternativ: [
      { svarVerdi: 'Ja', label: 'svar.ja' },
      { svarVerdi: 'Nei', label: 'svar.nei' },
    ],
    svarAlternativLayout: 'horizontal',
  };
