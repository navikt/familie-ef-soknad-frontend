import {
  SpørsmålNode,
  SpørsmålSvarInputType,
} from '../../../../components/spørsmål/komponent/Spørsmål';

/* TODO: Legg til type for "info". Denne skal ikke ha noen form for svar alternativ og kun vise en beskrivelse med en lenke til papirsøknad.*/
export const skalDuIkkeEndreAdresseIFolkeregisteret: SpørsmålNode = {
  id: 'personopplysninger.info.endreAdresse',
  spørsmålTekstKey: 'personopplysninger.info.endreAdresse',
  spørsmålSvarInputType: SpørsmålSvarInputType.RADIO,

  alerts: [
    {
      id: 'personopplysninger.lenke.pdfskjema',
      alertTekstKey: 'personopplysninger.lenke.pdfskjema',
      alertVariant: 'warning',
      visAlertNår: (input) =>
        input['personopplysninger.spm.meldtAdresseendring'] === 'ja',
    },
  ],
};
