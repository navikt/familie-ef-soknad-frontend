import { Textarea } from '@navikt/ds-react';
import type React from 'react';
import type { FC } from 'react';
import MultiSvarSpørsmålMedNavn from '../../../../../components/spørsmål/MultiSvarSpørsmålMedNavn';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import type { ISpørsmål, ISvar } from '../../../../../models/felles/spørsmålogsvar';
import type { IBarn } from '../../../../../models/steg/barn';
import { EBorAnnenForelderISammeHus } from '../../../../../models/steg/barnasbosted';
import type { IForelder } from '../../../../../models/steg/forelder';
import { hentBarnNavnEllerBarnet } from '../../../../../utils/barn';
import { hentTekst } from '../../../../../utils/teksthåndtering';
import { borAnnenForelderISammeHus } from '../ForeldreConfig';

interface Props {
    forelder: IForelder;
    settForelder: (verdi: IForelder) => void;
    barn: IBarn;
}
export const BorAnnenForelderISammeHus: FC<Props> = ({ forelder, settForelder, barn }) => {
    const intl = useLokalIntlContext();

    const borAnnenForelderISammeHusConfig = borAnnenForelderISammeHus(intl);

    const settBorAnnenForelderISammeHus = (spørsmål: ISpørsmål, valgtSvar: ISvar) => {
        const nyForelder = {
            ...forelder,
            [borAnnenForelderISammeHusConfig.søknadid]: {
                spørsmålid: spørsmål.søknadid,
                svarid: valgtSvar.id,
                label: hentTekst('barnasbosted.spm.borAnnenForelderISammeHus', intl),
                verdi: valgtSvar.svar_tekst,
            },
        };

        if (valgtSvar.id === EBorAnnenForelderISammeHus.nei || valgtSvar.id === EBorAnnenForelderISammeHus.vetikke) {
            delete nyForelder.borAnnenForelderISammeHusBeskrivelse;
        }

        settForelder(nyForelder);
    };

    const settBorAnnenForelderISammeHusBeskrivelse = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        settForelder({
            ...forelder,
            borAnnenForelderISammeHusBeskrivelse: {
                label: hentTekst('barnasbosted.spm.borAnnenForelderISammeHusBeskrivelse', intl),
                verdi: e.target.value,
            },
        });
    };

    return (
        <>
            <MultiSvarSpørsmålMedNavn
                key={borAnnenForelderISammeHusConfig.søknadid}
                spørsmål={borAnnenForelderISammeHusConfig}
                spørsmålTekst={hentBarnNavnEllerBarnet(barn, borAnnenForelderISammeHusConfig.tekstid, intl)}
                valgtSvar={forelder.borAnnenForelderISammeHus?.verdi}
                settSpørsmålOgSvar={(spørsmål, svar) => settBorAnnenForelderISammeHus(spørsmål, svar)}
            />
            {forelder.borAnnenForelderISammeHus?.svarid === EBorAnnenForelderISammeHus.ja && (
                <Textarea
                    autoComplete={'off'}
                    value={
                        forelder.borAnnenForelderISammeHusBeskrivelse &&
                        forelder.borAnnenForelderISammeHusBeskrivelse.verdi
                            ? forelder.borAnnenForelderISammeHusBeskrivelse.verdi
                            : ''
                    }
                    onChange={settBorAnnenForelderISammeHusBeskrivelse}
                    label={hentTekst('barnasbosted.spm.borAnnenForelderISammeHusBeskrivelse', intl)}
                />
            )}
        </>
    );
};
