import React, { useState } from 'react';
import { AkselSpørsmål } from './AkselSpørsmål';
import { VStack } from '@navikt/ds-react';
import { useLokalIntlContext } from '../../../context/LokalIntlContext';
import { hentTekst } from '../../../utils/søknad';

type AnswerMap = Record<string, string | undefined>;

interface SpørsmålKonfig {
  id: string;
  spørsmålId: string;
  svaralternativer: string[];
  dependsOn?: {
    questionId: string;
    value: string;
  };
}

const spørsmål: SpørsmålKonfig[] = [
  {
    id: 'borPåAdresse',
    spørsmålId: 'personopplysninger.spm.riktigAdresse',
    svaralternativer: ['Ja', 'Nei'],
  },
  {
    id: 'meldtEndringTilFolkeregisteret',
    spørsmålId: 'personopplysninger.spm.meldtAdresseendring',
    svaralternativer: ['Ja', 'Nei'],
    dependsOn: {
      questionId: 'borPåAdresse',
      value: 'Nei',
    },
  },
];

export const OmDegSpørsmålSeksjon: React.FC = () => {
  const [svar, setSvar] = useState<AnswerMap>({});
  const intl = useLokalIntlContext();

  const håndterSvar = (id: string, verdi: string) => {
    setSvar((prev) => ({
      ...prev,
      [id]: verdi,
    }));
  };

  const skalViseSpørsmål = (spm: SpørsmålKonfig): boolean => {
    if (!spm.dependsOn) return true;
    return svar[spm.dependsOn.questionId] === spm.dependsOn.value;
  };

  return (
    <VStack gap="8">
      {spørsmål.filter(skalViseSpørsmål).map((spm) => (
        <AkselSpørsmål
          key={spm.id}
          id={spm.id}
          spørsmål={hentTekst(spm.spørsmålId, intl)}
          svaralternativer={spm.svaralternativer}
          verdi={svar[spm.id]}
          onChange={håndterSvar}
        />
      ))}
    </VStack>
  );
};
