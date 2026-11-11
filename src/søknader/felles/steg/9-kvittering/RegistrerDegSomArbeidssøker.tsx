import { BodyShort, Link, VStack } from '@navikt/ds-react';
import type { FC } from 'react';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { hentTekst } from '../../../../utils/teksthåndtering';

export const RegistrerDegSomArbeidssøker: FC = () => {
    const intl = useLokalIntlContext();
    return (
        <VStack gap={'space-16'}>
            <BodyShort>{hentTekst('kvittering.tekst.arbeidssøker', intl)}</BodyShort>
            <Link href={'https://arbeidssokerregistrering.nav.no/'}>
                {hentTekst('kvittering.knapp.arbeidssøker', intl)}
            </Link>
        </VStack>
    );
};
