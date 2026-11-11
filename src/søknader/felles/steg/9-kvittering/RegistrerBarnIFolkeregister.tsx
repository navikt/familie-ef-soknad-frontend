import { BodyShort, Heading, VStack } from '@navikt/ds-react';
import type { FC } from 'react';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import type { IBarn } from '../../../../models/steg/barn';
import { ESkalBarnetBoHosSøker } from '../../../../models/steg/barnasbosted';
import { flereBarnsNavn } from '../../../../utils/barn';
import { hentTekst, hentTekstMedEnVariabel } from '../../../../utils/teksthåndtering';

interface Props {
    barna: IBarn[];
}

export const RegistrerBarnIFolkeregister: FC<Props> = ({ barna }) => {
    const intl = useLokalIntlContext();

    const barnSomSkalRegistreresIFolkeregister = barna.filter(barn => {
        return barn?.forelder?.skalBarnetBoHosSøker?.svarid === ESkalBarnetBoHosSøker.ja;
    });

    if (barnSomSkalRegistreresIFolkeregister.length === 0) {
        return null;
    }

    const barnasNavn = flereBarnsNavn(barnSomSkalRegistreresIFolkeregister, intl);
    const tekst = hentTekstMedEnVariabel('barnasbosted.skalBliFolkeregistrert.tekst', intl, barnasNavn);

    return (
        <VStack gap={'space-16'}>
            <Heading size={'small'} spacing={true}>
                {tekst}
            </Heading>
            <BodyShort>{tekst}</BodyShort>
            <a
                target={'_blank'}
                rel={'noreferrer noopener'}
                className={'knapp knapp--standard kvittering'}
                href={'https://www.skatteetaten.no/person/folkeregister/flytte/i-norge/'}
            >
                {hentTekst('barnasbosted.skalBliFolkeregistrert.knapp', intl)}
            </a>
        </VStack>
    );
};
