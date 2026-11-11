import { Heading, Textarea, VStack } from '@navikt/ds-react';
import type React from 'react';
import { AlertStripeDokumentasjon } from '../../../../components/AlertstripeDokumentasjon';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { EAktivitet, EArbeidssituasjon, type IAktivitet } from '../../../../models/steg/aktivitet/aktivitet';
import { hentHTMLTekst, hentTekst } from '../../../../utils/teksthåndtering';

interface Props {
    arbeidssituasjon: IAktivitet;
    settArbeidssituasjon: (nyArbeidssituasjon: IAktivitet) => void;
}

export const EtablererEgenVirksomhet: React.FC<Props> = ({ arbeidssituasjon, settArbeidssituasjon }) => {
    const { etablererEgenVirksomhet } = arbeidssituasjon;
    const intl = useLokalIntlContext();

    const settTekstfelt = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        settArbeidssituasjon({
            ...arbeidssituasjon,
            etablererEgenVirksomhet: {
                spørsmålid: EArbeidssituasjon.etablererEgenVirksomhet,
                svarid: EAktivitet.etablererEgenVirksomhet,
                label: hentTekst('arbeidssituasjon.label.etablererEgenVirksomhet', intl),
                verdi: e.target.value,
            },
        });
    };

    return (
        <VStack gap={'space-16'}>
            <Heading size="small" level="3">
                {hentTekst('arbeidssituasjon.tittel.etablererEgenVirksomhet', intl)}
            </Heading>
            <Textarea
                autoComplete={'off'}
                label={hentTekst('arbeidssituasjon.label.etablererEgenVirksomhet', intl)}
                value={etablererEgenVirksomhet?.verdi ? etablererEgenVirksomhet.verdi : ''}
                maxLength={2000}
                onChange={e => settTekstfelt(e)}
            />
            <AlertStripeDokumentasjon>
                {hentHTMLTekst('arbeidssituasjon.alert.etablererEgenVirksomhet', intl)}
            </AlertStripeDokumentasjon>
        </VStack>
    );
};
