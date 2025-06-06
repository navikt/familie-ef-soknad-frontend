import { SingleSelectSpørsmål } from '../../../../components/spørsmål/komponent/nyrefaktorering/Spørsmål';

export const erDuSeparertEllerSkiltUtenAtDetteErRegistrertIFolkeregisteretINorgeSpørsmål: SingleSelectSpørsmål =
  {
    id: 'erDuSeparertEllerSkiltUtenAtDetteErRegistrertIFolkeregisteretINorge',
    spørsmålTekstKey: 'sivilstatus.spm.erUformeltSeparertEllerSkilt',

    type: 'single-select',

    svarAlternativ: [
      { svarVerdi: 'Ja', label: 'svar.ja' },
      { svarVerdi: 'Nei', label: 'svar.nei' },
    ],
    svarAlternativLayout: 'horizontal',

    alerts: [
      {
        id: 'sivilstatus.alert.erUformeltSeparertEllerSkilt',
        alertTekstKey: 'sivilstatus.alert.erUformeltSeparertEllerSkilt',
        alertVariant: 'info',
        inline: true,
        visAlertNår: ({ valgtSvar }) => valgtSvar === 'Ja',
      },
    ],
  };
