// SpørsmålRenderer.tsx
import React, { useState } from 'react';
import { OppfølgningsSpørsmål, Spørsmål } from './Spørsmål';
import { SingleSelectSpørsmålKomponent } from './spørsmåltyper/SingleSelectSpørsmålKomponent';

interface Props {
  spørsmål: Spørsmål;
}

export const SpørsmålRenderer: React.FC<Props> = ({ spørsmål }) => {
  const [valgtSvar, settValgtSvar] = useState<string | null>(null);

  const renderKomponent = () => {
    switch (spørsmål.type) {
      case 'single-select':
        return (
          <SingleSelectSpørsmålKomponent
            spørsmål={spørsmål}
            valgtSvar={valgtSvar}
            onChangeSvar={settValgtSvar}
          />
        );
      default:
        return <div>Ukjent spørsmålstype: {spørsmål.type}</div>;
    }
  };

  return (
    <>
      {renderKomponent()}

      {valgtSvar &&
        spørsmål.oppfølgningsSpørsmål
          ?.filter((oppfølgningsSpørsmål: OppfølgningsSpørsmål) =>
            oppfølgningsSpørsmål.visNår(valgtSvar)
          )
          .map((oppfølgningsSpørsmål: OppfølgningsSpørsmål) => (
            <SpørsmålRenderer
              key={oppfølgningsSpørsmål.spørsmål.id}
              spørsmål={oppfølgningsSpørsmål.spørsmål}
            />
          ))}
    </>
  );
};
