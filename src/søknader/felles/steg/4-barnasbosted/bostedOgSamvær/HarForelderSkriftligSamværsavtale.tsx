import { VStack } from '@navikt/ds-react';
import React, { type FC } from 'react';
import { AlertStripeDokumentasjon } from '../../../../../components/AlertstripeDokumentasjon';
import MultiSvarSpørsmålMedNavn from '../../../../../components/spørsmål/MultiSvarSpørsmålMedNavn';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import type { ISpørsmål, ISvar } from '../../../../../models/felles/spørsmålogsvar';
import type { IBarn } from '../../../../../models/steg/barn';
import { EHarSkriftligSamværsavtale } from '../../../../../models/steg/barnasbosted';
import type { IForelder } from '../../../../../models/steg/forelder';
import { hentBarnNavnEllerBarnet } from '../../../../../utils/barn';
import { hentTekst } from '../../../../../utils/teksthåndtering';
import { harDereSkriftligSamværsavtale } from '../ForeldreConfig';

interface Props {
    forelder: IForelder;
    settBostedOgSamværFelt: (spørsmål: ISpørsmål, svar: ISvar) => void;
    barn: IBarn;
}
export const HarForelderSkriftligSamværsavtale: FC<Props> = ({ forelder, settBostedOgSamværFelt, barn }) => {
    const intl = useLokalIntlContext();
    const harDereSkriftligSamværsavtaleSpm = harDereSkriftligSamværsavtale(intl);
    return (
        <VStack gap={'space-8'}>
            <MultiSvarSpørsmålMedNavn
                key={harDereSkriftligSamværsavtaleSpm.søknadid}
                spørsmål={harDereSkriftligSamværsavtaleSpm}
                spørsmålTekst={hentBarnNavnEllerBarnet(barn, harDereSkriftligSamværsavtaleSpm.tekstid, intl)}
                valgtSvar={forelder.harDereSkriftligSamværsavtale?.verdi}
                settSpørsmålOgSvar={settBostedOgSamværFelt}
            />
            {(forelder.harDereSkriftligSamværsavtale?.svarid === EHarSkriftligSamværsavtale.jaIkkeKonkreteTidspunkter ||
                forelder.harDereSkriftligSamværsavtale?.svarid ===
                    EHarSkriftligSamværsavtale.jaKonkreteTidspunkter) && (
                <AlertStripeDokumentasjon>
                    {hentTekst('barnasbosted.alert.leggeVedSamværsavtalen', intl)}
                </AlertStripeDokumentasjon>
            )}
        </VStack>
    );
};
