import { VStack } from '@navikt/ds-react';
import type React from 'react';
import { usePersonContext } from '../../../../../context/PersonContext';
import { erSivilstandSpørsmålBesvart } from '../../../../../helpers/steg/omdeg';
import { erSøkerGift, erSøkerUGiftSkiltSeparertEllerEnke } from '../../../../../utils/sivilstatus';
import { useOmDeg } from '../OmDegContext';
import { ÅrsakEnslig } from './begrunnelse/ÅrsakEnslig';
import { SpørsmålGiftSeparertEllerSkiltIkkeRegistrert } from './SpørsmålGiftSeparertEllerSkiltIkkeRegistrert';
import { SøkerErGift } from './SøkerErGift';

export const Sivilstatus: React.FC = () => {
    const { sivilstatus } = useOmDeg();
    const { person } = usePersonContext();
    const sivilstand = person.søker.sivilstand;

    const visSøkerErGift = erSøkerGift(sivilstand);
    const visGiftSeparertEllerSkiltIkkeRegistrert = erSøkerUGiftSkiltSeparertEllerEnke(sivilstand);
    const visÅrsakEnslig = erSivilstandSpørsmålBesvart(sivilstand, sivilstatus);

    return (
        <VStack gap={'space-24'}>
            {visSøkerErGift && <SøkerErGift />}

            {visGiftSeparertEllerSkiltIkkeRegistrert && <SpørsmålGiftSeparertEllerSkiltIkkeRegistrert />}

            {visÅrsakEnslig && <ÅrsakEnslig />}
        </VStack>
    );
};
