import { SingleSelectSpørsmål } from '../../../../components/spørsmål/komponent/nyrefaktorering/Spørsmål';

export const erDuGiftUtenAtDetErFolkeregistrertINorgeSpørsmål: SingleSelectSpørsmål =
  {
    id: 'sivilstatus.spm.erUformeltGift',
    spørsmålTekstKey: 'sivilstatus.spm.erUformeltGift',

    type: 'single-select',

    svarAlternativ: [
      { svarVerdi: 'ja', label: 'svar.ja' },
      { svarVerdi: 'nei', label: 'svar.nei' },
    ],
    svarAlternativLayout: 'horizontal',

    lesMerTittelKey: 'sivilstatus.lesmer-åpne.erUformeltGift',
    lesMerTekstKey: 'sivilstatus.lesmer-innhold.erUformeltGift',

    alerts: [
      {
        id: 'sivilstatus.alert.erUformeltGift',
        alertTekstKey: 'sivilstatus.alert.erUformeltGift',
        alertVariant: 'info',
        visAlertNår: ({ valgtSvar }) => valgtSvar === 'Ja',
      },
    ],
  };
