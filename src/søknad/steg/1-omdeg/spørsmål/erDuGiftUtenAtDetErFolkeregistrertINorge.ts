import {
  SpørsmålNode,
  SpørsmålSvarInputType,
} from '../../../../components/spørsmål/komponent/Spørsmål';

export const erDuGiftUtenAtDetErFolkeregistrertINorge: SpørsmålNode = {
  id: 'sivilstatus.spm.erUformeltGift',
  spørsmålTekstKey: 'sivilstatus.spm.erUformeltGift',
  spørsmålSvarInputType: SpørsmålSvarInputType.RADIO,
  alternativer: [
    { value: 'ja', labelKey: 'svar.ja' },
    { value: 'nei', labelKey: 'svar.nei' },
  ],
  lesMerTittelKey: 'sivilstatus.lesmer-åpne.erUformeltGift',
  lesMerTekstKey: 'sivilstatus.lesmer- innhold.erUformeltGift',
  alerts: [
    {
      id: 'sivilstatus.alert.erUformeltGift',
      alertTekstKey: 'sivilstatus.aler t.erUformeltGift',
      alertVariant: 'info',
      visAlertNår: (input) => input['sivilstatus.spm.erUformeltGift'] === 'ja',
    },
  ],
  next: {
    ja: 'sivilstatus.spm.erUformeltGift',
    nei: 'personopplysninger.spm.meldtAdresseendring',
  },
};
