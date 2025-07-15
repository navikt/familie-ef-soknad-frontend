import React from 'react';
import SøkerErGift from './SøkerErGift';
import { usePersonContext } from '../../../../../context/PersonContext';
import SpørsmålGiftSeparertEllerSkiltIkkeRegistrert from './SpørsmålGiftSeparertEllerSkiltIkkeRegistrert';
import { erSøkerGift, erSøkerUGiftSkiltSeparertEllerEnke } from '../../../../../utils/sivilstatus';
import ÅrsakEnslig from './begrunnelse/ÅrsakEnslig';
import { erSivilstandSpørsmålBesvart } from '../../../../../helpers/steg/omdeg';
import { useOmDeg } from '../OmDegContext';
import { SivilstatusV2 } from './SivilstatusV2';
import { VStack } from '@navikt/ds-react';

const Sivilstatus: React.FC = () => {
  const { sivilstatus } = useOmDeg();
  const { person } = usePersonContext();
  const sivilstand = person.søker.sivilstand;

  return (
    <VStack gap={'6'}>
      <SivilstatusV2 />

      {/* TODO: Fjern meg! */}
      <div
        style={{
          borderBottom: '1px solid #e5e7eb',
          margin: '16px 0',
          opacity: 0.5,
        }}
      />

      {erSøkerGift(sivilstand) && <SøkerErGift />}
      {erSøkerUGiftSkiltSeparertEllerEnke(sivilstand) && (
        <SpørsmålGiftSeparertEllerSkiltIkkeRegistrert />
      )}
      {erSivilstandSpørsmålBesvart(sivilstand, sivilstatus) && <ÅrsakEnslig />}
    </VStack>
  );
};

export default Sivilstatus;
