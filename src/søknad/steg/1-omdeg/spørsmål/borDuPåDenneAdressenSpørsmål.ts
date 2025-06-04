import { SingleSelectSpørsmål } from '../../../../components/spørsmål/komponent/nyrefaktorering/Spørsmål';

export const borDuPåDenneAdressenSpørsmål: SingleSelectSpørsmål = {
  id: 'borDuPåDenneAdressen',
  spørsmålTekstKey: 'personopplysninger.spm.riktigAdresse',

  type: 'single-select',

  svarAlternativ: [
    { svarVerdi: 'Ja', label: 'svar.ja' },
    { svarVerdi: 'Nei', label: 'svar.nei' },
  ],
  svarAlternativLayout: 'horizontal',
};
