import { BodyShort, Label, VStack } from '@navikt/ds-react';
import type React from 'react';
import { AlertStripeDokumentasjon } from '../../../../components/AlertstripeDokumentasjon';
import { Datovelger } from '../../../../components/dato/Datovelger';
import { GyldigeDatoer } from '../../../../components/dato/GyldigeDatoer';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import type { IAktivitet } from '../../../../models/steg/aktivitet/aktivitet';
import { hentHTMLTekst, hentTekst } from '../../../../utils/teksthåndtering';

interface Props {
    arbeidssituasjon: IAktivitet;
    settArbeidssituasjon: (arbeidssituasjon: IAktivitet) => void;
}
export const FåttJobbTilbud: React.FC<Props> = ({ arbeidssituasjon, settArbeidssituasjon }) => {
    const intl = useLokalIntlContext();

    const settDato = (dato: string) => {
        settArbeidssituasjon({
            ...arbeidssituasjon,
            datoOppstartJobb: {
                label: hentTekst('dinSituasjon.datovelger.jobb', intl),
                verdi: dato,
            },
        });
    };
    return (
        <VStack>
            <AlertStripeDokumentasjon>
                <Label as="p">{hentTekst('dokumentasjon.arbeidskontrakt.tittel', intl)}</Label>
                <br />
                <BodyShort size={'small'}>{hentHTMLTekst('dokumentasjon.arbeidskontrakt.beskrivelse', intl)}</BodyShort>
            </AlertStripeDokumentasjon>
            <Datovelger
                valgtDato={arbeidssituasjon.datoOppstartJobb?.verdi}
                tekstid={'dinSituasjon.datovelger.jobb'}
                gyldigeDatoer={GyldigeDatoer.Fremtidige}
                settDato={settDato}
            />
        </VStack>
    );
};
