import {
  SpørsmålNode,
  SpørsmålSvarInputType,
} from '../../../../components/spørsmål/komponent/Spørsmål';

export const harDuMeldtAdresseendringTilFolkeregisteret: SpørsmålNode = {
  id: 'personopplysninger.spm.meldtAdresseendring',
  spørsmålTekstKey: 'personopplysninger.spm.meldtAdresseendring',
  spørsmålSvarInputType: SpørsmålSvarInputType.RADIO,

  alternativer: [
    { value: 'ja', labelKey: 'svar.ja' },
    { value: 'nei', labelKey: 'svar.nei' },
  ],

  alerts: [
    {
      id: 'personopplysninger.alert.meldtAdresseendring',
      alertTekstKey: 'personopplysninger.alert.meldtAdresseendring',
      alertVariant: 'info',
      visAlertNår: (input) =>
        input['personopplysninger.spm.meldtAdresseendring'] === 'ja',
    },
    {
      id: 'personopplysninger.alert.riktigAdresse',
      alertTekstKey: 'personopplysninger.alert.riktigAdresse',
      alertVariant: 'warning',
      visAlertNår: (input) =>
        input['personopplysninger.spm.meldtAdresseendring'] === 'nei',
    },
  ],

  next: {
    ja: 'sivilstatus.spm.erUformeltGift',
    nei: 'personopplysninger.info.endreAdresse',
  },
};
