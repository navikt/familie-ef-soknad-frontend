import type React from 'react';
import MultiSvarSpørsmålMedNavn from '../../../../../components/spørsmål/MultiSvarSpørsmålMedNavn';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import {
    harForelderSamværMedBarn,
    hvisEndretSvarSlettFeltHvordanPraktiseresSamværet,
    måBeskriveSamværet,
} from '../../../../../helpers/steg/forelder';
import { ESvar, type ISpørsmål, type ISvar } from '../../../../../models/felles/spørsmålogsvar';
import type { IBarn } from '../../../../../models/steg/barn';
import { EForelder, type IForelder } from '../../../../../models/steg/forelder';
import { hentBarnNavnEllerBarnet } from '../../../../../utils/barn';
import { erJaNeiSvar, hentBooleanFraValgtSvar } from '../../../../../utils/spørsmålogsvar';
import { hentTekst } from '../../../../../utils/teksthåndtering';
import { useBarnasBosted } from '../BarnasBostedContext';
import { harAnnenForelderSamværMedBarn } from '../ForeldreConfig';
import { HvordanPraktiseresSamværet } from '../HvordanPraktiseresSamværet';
import { HarForelderSkriftligSamværsavtale } from './HarForelderSkriftligSamværsavtale';

interface Props {
    settForelder: (verdi: IForelder) => void;
    forelder: IForelder;
    barn: IBarn;
}

export const BostedOgSamvær: React.FC<Props> = ({ settForelder, forelder, barn }) => {
    const intl = useLokalIntlContext();

    const harAnnenForelderSamværMedBarnConfig = harAnnenForelderSamværMedBarn(intl, barn);
    const { settDokumentasjonsbehovForBarn } = useBarnasBosted();

    const settBostedOgSamværFelt = (spørsmål: ISpørsmål, svar: ISvar) => {
        const nyForelder = {
            ...forelder,
            [spørsmål.søknadid]: {
                spørsmålid: spørsmål.søknadid,
                svarid: svar.id,
                label: hentTekst(spørsmål.tekstid, intl),
                verdi: erJaNeiSvar(svar) ? hentBooleanFraValgtSvar(svar) : svar.svar_tekst,
            },
        };

        if (hvisEndretSvarSlettFeltHvordanPraktiseresSamværet(spørsmål, svar) && nyForelder.hvordanPraktiseresSamværet)
            delete nyForelder.hvordanPraktiseresSamværet;

        if (spørsmål.søknadid === EForelder.borINorge && nyForelder.land && svar.id === ESvar.JA) {
            delete nyForelder.land;
        }

        settForelder(nyForelder);
        settDokumentasjonsbehovForBarn(spørsmål, svar, barn.id);
    };

    return (
        <>
            <MultiSvarSpørsmålMedNavn
                key={harAnnenForelderSamværMedBarnConfig.søknadid}
                spørsmål={harAnnenForelderSamværMedBarnConfig}
                spørsmålTekst={hentBarnNavnEllerBarnet(barn, harAnnenForelderSamværMedBarnConfig.tekstid, intl)}
                valgtSvar={forelder.harAnnenForelderSamværMedBarn?.verdi}
                settSpørsmålOgSvar={settBostedOgSamværFelt}
            />
            {harForelderSamværMedBarn(forelder.harAnnenForelderSamværMedBarn?.svarid) && (
                <HarForelderSkriftligSamværsavtale
                    forelder={forelder}
                    settBostedOgSamværFelt={settBostedOgSamværFelt}
                    barn={barn}
                />
            )}
            {måBeskriveSamværet(
                forelder.harDereSkriftligSamværsavtale?.svarid,
                forelder.harAnnenForelderSamværMedBarn?.svarid
            ) && <HvordanPraktiseresSamværet forelder={forelder} settForelder={settForelder} />}
        </>
    );
};
