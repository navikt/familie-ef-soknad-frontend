import { SingleSelectSpørsmål } from '../../../../components/spørsmål/komponent/nyrefaktorering/Spørsmål';

export const erDuGiftUtenAtDetErFolkeregistrertINorgeSpørsmål: SingleSelectSpørsmål =
  {
    id: 'erDuGiftUtenAtDetErFolkeregistrertINorge',
    spørsmålTekstKey: 'sivilstatus.spm.erUformeltGift',

    type: 'single-select',

    svarAlternativ: [
      { svarVerdi: 'Ja', label: 'svar.ja' },
      { svarVerdi: 'Nei', label: 'svar.nei' },
    ],
    svarAlternativLayout: 'horizontal',

    lesMerTittelKey: 'sivilstatus.lesmer-åpne.erUformeltGift',
    lesMerTekstKey: 'sivilstatus.lesmer-innhold.erUformeltGift',

    alerts: [
      {
        id: 'alerterUformeltGift',
        alertTekstKey: 'sivilstatus.alert.erUformeltGift',
        alertVariant: 'info',
        inline: true,
        visAlertNår: ({ valgtSvar }) => valgtSvar === 'Ja',
      },
    ],
  };
