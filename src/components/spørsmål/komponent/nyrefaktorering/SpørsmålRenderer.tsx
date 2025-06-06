/*
import React, { useState } from 'react';
import { OppfølgningsSpørsmål, Spørsmål } from './Spørsmål';
import { SingleSelectSpørsmålKomponent } from './spørsmåltyper/SingleSelectSpørsmålKomponent';
import { oppfølgingsSpørsmålMap } from '../../../../søknad/steg/1-omdeg/spørsmål/oppfølgningsSpørsmålMap';

interface Props {
  spørsmål: Spørsmål;
}

export const SpørsmålRenderer: React.FC<Props> = ({ spørsmål }) => {
  const [valgtSvar, settValgtSvar] = useState<string | null>(null);
  const oppfølgere: OppfølgningsSpørsmål[] =
    oppfølgingsSpørsmålMap[spørsmål.id] || [];

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
        oppfølgere
          .filter((oppfølgningsSpørsmål) =>
            oppfølgningsSpørsmål.visNår(valgtSvar)
          )
          .map((oppfølgningsSpørmål) => (
            <SpørsmålRenderer
              key={oppfølgningsSpørmål.spørsmål.id}
              spørsmål={oppfølgningsSpørmål.spørsmål}
            />
          ))}
    </>
  );
};
*/
