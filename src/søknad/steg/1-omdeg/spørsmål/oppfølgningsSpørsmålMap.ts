import { OppfølgningsSpørsmål } from '../../../../components/spørsmål/komponent/nyrefaktorering/Spørsmål';
import { erDuGiftUtenAtDetErFolkeregistrertINorgeSpørsmål } from './erDuGiftUtenAtDetErFolkeregistrertINorgeSpørsmål';
import { harDuMeldtAdresseendringTilFolkeregisteretSpørsmål } from './harDuMeldtAdresseendringTilFolkeregisteretSpørsmål';
import { erDuSeparertEllerSkiltUtenAtDetteErRegistrertIFolkeregisteretINorgeSpørsmål } from './erDuSeparertEllerSkiltUtenAtDetteErRegistrertIFolkeregisteretINorgeSpørsmål';
import { hvorforErDuAleneMedBarnSpørsmål } from './hvorforErDuAleneMedBarnSpørsmål';

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
      visNår: (valgtSvar) => valgtSvar === 'Ja',
      spørsmål: erDuGiftUtenAtDetErFolkeregistrertINorgeSpørsmål,
    },
  ],

  erDuGiftUtenAtDetErFolkeregistrertINorge: [
    {
      visNår: (valgtSvar) => valgtSvar !== null,
      spørsmål: erDuSeparertEllerSkiltUtenAtDetteErRegistrertIFolkeregisteretINorgeSpørsmål,
    },
  ],

  erDuSeparertEllerSkiltUtenAtDetteErRegistrertIFolkeregisteretINorge: [
    {
      visNår: (valgtSvar) => valgtSvar !== null,
      spørsmål: hvorforErDuAleneMedBarnSpørsmål,
    },
  ],
};
