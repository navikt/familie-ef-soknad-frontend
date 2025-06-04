import { OppfølgningsSpørsmål } from '../../../../components/spørsmål/komponent/nyrefaktorering/Spørsmål';
import { erDuGiftUtenAtDetErFolkeregistrertINorgeSpørsmål } from './erDuGiftUtenAtDetErFolkeregistrertINorgeSpørsmål';
import { harDuMeldtAdresseendringTilFolkeregisteretSpørsmål } from './harDuMeldtAdresseendringTilFolkeregisteretSpørsmål';

export const oppfølgingsSpørsmålMap: Record<string, OppfølgningsSpørsmål[]> = {
  borDuPåDenneAdressen: [
    {
      visNår: (valgtSvar) => valgtSvar === 'Ja',
      spørsmål: erDuGiftUtenAtDetErFolkeregistrertINorgeSpørsmål,
    },
    {
      visNår: (valgtSvar) => valgtSvar === 'Nei',
      spørsmål: harDuMeldtAdresseendringTilFolkeregisteretSpørsmål,
    },
  ],

  harDuMeldtAdresseendringTilFolkeregisteret: [
    {
      visNår: (valgtSvar) => valgtSvar === 'Nei',
      spørsmål: erDuGiftUtenAtDetErFolkeregistrertINorgeSpørsmål,
    },
  ],

  erDuGiftUtenAtDetErFolkeregistrertINorge: [
    {
      visNår: () => true,
      spørsmål: erDuGiftUtenAtDetErFolkeregistrertINorgeSpørsmål,
    },
  ],
};
