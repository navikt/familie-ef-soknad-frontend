import { SingleSelectSpørsmål } from '../../../../components/spørsmål/komponent/nyrefaktorering/Spørsmål';

export const erDuSeparertEllerSkiltUtenAtDetteErRegistrertIFolkeregisteretINorgeSpørsmål: SingleSelectSpørsmål =
  {
    id: 'sivilstatus.spm.erUformeltSeparertEllerSkilt',
    spørsmålTekstKey: 'sivilstatus.spm.erUformeltSeparertEllerSkilt',

    type: 'single-select',

    svarAlternativ: [
      { svarVerdi: 'ja', label: 'svar.ja' },
      { svarVerdi: 'nei', label: 'svar.nei' },
    ],
    svarAlternativLayout: 'horizontal',

    alerts: [
      {
        id: 'sivilstatus.alert.erUformeltSeparertEllerSkilt',
        alertTekstKey: 'sivilstatus.alert.erUformeltSeparertEllerSkilt',
        alertVariant: 'info',
        visAlertNår: ({ valgtSvar }) => valgtSvar === 'Ja',
      },
    ],
  };
