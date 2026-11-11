import { Heading, Label, VStack } from '@navikt/ds-react';
import React, { type FC, useEffect, useState } from 'react';
import LeggTilKnapp from '../../../../../components/knapper/LeggTilKnapp';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { erAksjeselskapFerdigUtfylt } from '../../../../../helpers/steg/aktivitetvalidering';
import { nyttTekstFelt } from '../../../../../helpers/tommeSøknadsfelter';
import type { IAksjeselskap, IAktivitet } from '../../../../../models/steg/aktivitet/aktivitet';
import { hentUid } from '../../../../../utils/autentiseringogvalidering/uuid';
import { hentTekst } from '../../../../../utils/teksthåndtering';
import { Aksjeselskap } from './Aksjeselskap';

interface Props {
    arbeidssituasjon: IAktivitet;
    settArbeidssituasjon: (arbeidssituasjon: IAktivitet) => void;
    inkludertArbeidsmengde?: boolean;
}

const tomtAksjeselskap = (inkludertArbeidsmengde: boolean): IAksjeselskap => {
    return inkludertArbeidsmengde
        ? {
              id: hentUid(),
              navn: nyttTekstFelt,
              arbeidsmengde: nyttTekstFelt,
          }
        : {
              id: hentUid(),
              navn: nyttTekstFelt,
          };
};
export const EgetAS: FC<Props> = ({ arbeidssituasjon, settArbeidssituasjon, inkludertArbeidsmengde = true }) => {
    const intl = useLokalIntlContext();
    const [egetAS, settEgetAS] = useState<IAksjeselskap[]>(
        arbeidssituasjon.egetAS ? arbeidssituasjon.egetAS : [tomtAksjeselskap(inkludertArbeidsmengde)]
    );

    useEffect(() => {
        settArbeidssituasjon({ ...arbeidssituasjon, egetAS: egetAS });
    }, [egetAS]);

    const leggTilAksjeselskap = () => {
        const nyttAksjeselskap: IAksjeselskap = tomtAksjeselskap(inkludertArbeidsmengde);
        const arbeidsforhold: IAksjeselskap[] = egetAS;
        arbeidsforhold.push(nyttAksjeselskap);
        settArbeidssituasjon({ ...arbeidssituasjon, egetAS: arbeidsforhold });
    };

    return (
        <VStack gap={'space-48'}>
            <Heading size="small" level="3" align={'center'}>
                {hentTekst('egetAS.tittel', intl)}
            </Heading>
            {arbeidssituasjon.egetAS?.map((aksjeselskap, index) => {
                return (
                    <Aksjeselskap
                        key={index}
                        egetAS={egetAS}
                        settEgetAS={settEgetAS}
                        aksjeselskapnummer={index}
                        inkludertArbeidsmengde={inkludertArbeidsmengde}
                    />
                );
            })}
            {erAksjeselskapFerdigUtfylt(egetAS, inkludertArbeidsmengde) && (
                <VStack align={'start'}>
                    <Label as="p">{hentTekst('egetAS.label.flere', intl)}</Label>
                    <LeggTilKnapp onClick={() => leggTilAksjeselskap()}>
                        {hentTekst('egetAS.knapp.leggtil', intl)}
                    </LeggTilKnapp>
                </VStack>
            )}
        </VStack>
    );
};
