import { Label } from '@navikt/ds-react';
import type React from 'react';
import { AlertStripeDokumentasjon } from '../../../../components/AlertstripeDokumentasjon';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { hentHTMLTekst, hentTekst } from '../../../../utils/teksthåndtering';
import { BarnMedSærligeBehovBegrunnelse } from './BarnMedSærligeBehovBegrunnelse';
import { HvilkeBarnHarSærligeBehov } from './HvilkeBarnHarSærligeBehov';

export const BarnMedSærligeBehov: React.FC = () => {
    const intl = useLokalIntlContext();
    return (
        <>
            <AlertStripeDokumentasjon>
                <Label size={'small'}>{hentTekst('dinSituasjon.dok.harBarnMedSærligeBehov.tittel', intl)}</Label>
                <br />
                {hentHTMLTekst('dinSituasjon.dok.harBarnMedSærligeBehov.beskrivelse', intl)}
            </AlertStripeDokumentasjon>
            <HvilkeBarnHarSærligeBehov />
            <BarnMedSærligeBehovBegrunnelse />
        </>
    );
};
