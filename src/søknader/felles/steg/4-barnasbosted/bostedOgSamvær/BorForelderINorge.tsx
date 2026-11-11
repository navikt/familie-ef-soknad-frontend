import React, { type FC } from 'react';
import { JaNeiSpørsmålMedNavn } from '../../../../../components/spørsmål/JaNeiSpørsmålMedNavn';
import SelectSpørsmål from '../../../../../components/spørsmål/SelectSpørsmål';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { useSpråkContext } from '../../../../../context/SpråkContext';
import { ESvar, type ISpørsmål, type ISvar } from '../../../../../models/felles/spørsmålogsvar';
import type { IBarn } from '../../../../../models/steg/barn';
import { EForelder, type IForelder } from '../../../../../models/steg/forelder';
import type { ILandMedKode } from '../../../../../models/steg/omDeg/medlemskap';
import { hentBarnNavnEllerBarnet } from '../../../../../utils/barn';
import { erJaNeiSvar, hentBooleanFraValgtSvar } from '../../../../../utils/spørsmålogsvar';
import { hentTekst } from '../../../../../utils/teksthåndtering';
import { hentLand } from '../../1-omdeg/medlemskap/MedlemskapConfig';
import { useBarnasBosted } from '../BarnasBostedContext';
import { borINorge } from '../ForeldreConfig';

const utledOppholdslandConfig = (land: ILandMedKode[]): ISpørsmål => ({
    søknadid: 'denAndreForelderensOppholdsland',
    tekstid: 'barnasbosted.hvilketLand',
    flersvar: false,
    svaralternativer: land,
});

interface Props {
    barn: IBarn;
    forelder: IForelder;
    settForelder: (verdi: IForelder) => void;
}

export const BorForelderINorge: FC<Props> = ({ settForelder, barn, forelder }) => {
    const [locale] = useSpråkContext();
    const land = hentLand(locale);
    const oppholdslandConfig = utledOppholdslandConfig(land);
    const intl = useLokalIntlContext();
    const { settDokumentasjonsbehovForBarn } = useBarnasBosted();

    const settFelt = (spørsmål: ISpørsmål, svar: ISvar) => {
        const nyForelder = {
            ...forelder,
            [spørsmål.søknadid]: {
                spørsmålid: spørsmål.søknadid,
                svarid: svar.id,
                label: hentTekst(spørsmål.tekstid, intl),
                verdi: erJaNeiSvar(svar) ? hentBooleanFraValgtSvar(svar) : svar.svar_tekst,
            },
        };

        if (spørsmål.søknadid === EForelder.borINorge && nyForelder.land && svar.id === ESvar.JA) {
            delete nyForelder.land;
        }
        settForelder(nyForelder);
        settDokumentasjonsbehovForBarn(spørsmål, svar, barn.id);
    };

    const oppdaterMedforeldersOppholdsland = (spørsmål: ISpørsmål, valgtSvar: ISvar) => {
        settForelder({
            ...forelder,
            land: {
                label: hentTekst('barnasbosted.land', intl),
                verdi: valgtSvar.svar_tekst,
                svarid: valgtSvar.id,
                spørsmålid: spørsmål.søknadid,
            },
        });
    };

    return (
        <>
            <JaNeiSpørsmålMedNavn
                spørsmål={borINorge(intl)}
                spørsmålTekst={hentBarnNavnEllerBarnet(barn, borINorge(intl).tekstid, intl)}
                onChange={settFelt}
                valgtSvar={forelder.borINorge?.verdi}
            />
            {forelder.borINorge?.verdi === false && (
                <SelectSpørsmål
                    spørsmål={oppholdslandConfig}
                    valgtSvarId={forelder.land?.svarid}
                    settSpørsmålOgSvar={oppdaterMedforeldersOppholdsland}
                />
            )}
        </>
    );
};
