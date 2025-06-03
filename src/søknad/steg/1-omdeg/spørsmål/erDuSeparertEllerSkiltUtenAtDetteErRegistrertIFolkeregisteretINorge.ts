import {
  SpørsmålNode,
  SpørsmålSvarInputType,
} from '../../../../components/spørsmål/komponent/Spørsmål';

export const erDuSeparertEllerSkiltUtenAtDetteErRegistrertIFolkeregisteretINorge: SpørsmålNode =
  {
    id: 'sivilstatus.spm.erUformeltSeparertEllerSkilt',
    spørsmålTekstKey: 'sivilstatus.spm.erUformeltSeparertEllerSkilt',
    spørsmålSvarInputType: SpørsmålSvarInputType.RADIO,

    alternativer: [
      { value: 'ja', labelKey: 'svar.ja' },
      { value: 'nei', labelKey: 'svar.nei' },
    ],

    alerts: [
      {
        id: 'sivilstatus.alert.erUformeltSeparertEllerSkilt',
        alertTekstKey: 'sivilstatus.alert.erUformeltSeparertEllerSkilt',
        alertVariant: 'info',
        visAlertNår: (input) =>
          input['sivilstatus.spm.erUformeltSeparertEllerSkilt'] === 'ja',
      },
    ],

    next: {
      ja: 'sivilstatus.spm.erUformeltGift',
      nei: 'personopplysninger.spm.meldtAdresseendring',
    },
  };
