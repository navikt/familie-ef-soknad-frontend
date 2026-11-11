import createUseContext from 'constate';
import { useEffect, useState } from 'react';
import { useLokalIntlContext } from '../../context/LokalIntlContext';
import { useSpråkContext } from '../../context/SpråkContext';
import { useTidligereVedtak } from '../../context/TidligereVedtakContext';
import Environment from '../../Environment';
import {
    hentDokumentasjonTilFlersvarSpørsmål,
    oppdaterDokumentasjonTilEtSvarSpørsmål,
    oppdaterDokumentasjonTilEtSvarSpørsmålForBarn,
} from '../../helpers/steg/dokumentasjon';
import type { LocaleType, LokalIntlShape } from '../../language/typer';
import tomPerson from '../../mock/initialState.json';
import type { ISpørsmål, ISvar } from '../../models/felles/spørsmålogsvar';
import { EArbeidssituasjon } from '../../models/steg/aktivitet/aktivitet';
import type { IBarn } from '../../models/steg/barn';
import { EBosituasjon } from '../../models/steg/bosituasjon';
import type { IPerson } from '../../models/søknad/person';
import { MellomlagredeStønadstyper } from '../../models/søknad/stønadstyper';
import { oppdaterBarneliste, oppdaterBarnIBarneliste } from '../../utils/barn';
import { dagensDato, formatIsoDate } from '../../utils/dato';
import {
    hentMellomlagretSøknadFraDokument,
    mellomlagreSøknadTilDokument,
    nullstillMellomlagretSøknadTilDokument,
} from '../../utils/søknad';
import type { MellomlagretSøknadBarnetilsyn } from './models/mellomlagretSøknad';
import type { SøknadBarnetilsyn } from './models/søknad';
import { hvaErDinArbeidssituasjonSpm } from './steg/5-aktivitet/AktivitetConfig';

const initialState = (intl: LokalIntlShape): SøknadBarnetilsyn => {
    return {
        person: tomPerson,
        sivilstatus: {},
        medlemskap: {},
        bosituasjon: {
            delerBoligMedAndreVoksne: {
                spørsmålid: EBosituasjon.delerBoligMedAndreVoksne,
                svarid: '',
                label: '',
                verdi: '',
            },
        },
        aktivitet: {
            hvaErDinArbeidssituasjon: {
                spørsmålid: EArbeidssituasjon.hvaErDinArbeidssituasjon,
                svarid: [],
                label: '',
                verdi: [],
                alternativer: hvaErDinArbeidssituasjonSpm(intl).svaralternativer.map(
                    svaralternativ => svaralternativ.svar_tekst
                ),
            },
        },
        dokumentasjonsbehov: [],
        harBekreftet: false,
        datoPåbegyntSøknad: formatIsoDate(dagensDato),
        locale: '',
    };
};

const [BarnetilsynSøknadProvider, useBarnetilsynSøknad] = createUseContext(() => {
    const intl = useLokalIntlContext();
    BarnetilsynSøknadProvider.displayName = 'BARNETILSYN_PROVIDER';
    const [locale, setLocale] = useSpråkContext();
    const [søknad, settSøknad] = useState<SøknadBarnetilsyn>(initialState(intl));
    const [mellomlagretBarnetilsyn, settMellomlagretBarnetilsyn] = useState<MellomlagretSøknadBarnetilsyn>();

    const { harLøpendeBarnetilsynVedRegelendring2026 } = useTidligereVedtak();

    const skalBrukeRegelendringer2026 = !harLøpendeBarnetilsynVedRegelendring2026;

    useEffect(() => {
        if (mellomlagretBarnetilsyn?.locale && mellomlagretBarnetilsyn?.locale !== locale) {
            setLocale(mellomlagretBarnetilsyn.locale as LocaleType);
        }
    }, [mellomlagretBarnetilsyn, setLocale]);

    const hentMellomlagretBarnetilsyn = (): Promise<void> => {
        return hentMellomlagretSøknadFraDokument<MellomlagretSøknadBarnetilsyn>(
            MellomlagredeStønadstyper.barnetilsyn
        ).then((mellomlagretVersjon?: MellomlagretSøknadBarnetilsyn) => {
            if (mellomlagretVersjon) {
                settMellomlagretBarnetilsyn(mellomlagretVersjon);
            }
        });
    };

    const brukMellomlagretBarnetilsyn = () => {
        if (mellomlagretBarnetilsyn) {
            settSøknad(mellomlagretBarnetilsyn.søknad);
        }
    };

    const mellomlagreBarnetilsyn2 = (steg: string, oppdatertSøknad: SøknadBarnetilsyn) => {
        const utfyltSøknad = {
            søknad: oppdatertSøknad,
            modellVersjon: Environment().modellVersjon.barnetilsyn,
            gjeldendeSteg: steg,
            locale: locale,
        };
        mellomlagreSøknadTilDokument(utfyltSøknad, MellomlagredeStønadstyper.barnetilsyn);
        settMellomlagretBarnetilsyn(utfyltSøknad);
    };

    const mellomlagreBarnetilsyn = (steg: string) => {
        const utfyltSøknad = {
            søknad: søknad,
            modellVersjon: Environment().modellVersjon.barnetilsyn,
            gjeldendeSteg: steg,
            locale: locale,
        };
        mellomlagreSøknadTilDokument(utfyltSøknad, MellomlagredeStønadstyper.barnetilsyn);
        settMellomlagretBarnetilsyn(utfyltSøknad);
    };

    const nullstillMellomlagretBarnetilsyn = (): Promise<string> => {
        return nullstillMellomlagretSøknadTilDokument(MellomlagredeStønadstyper.barnetilsyn);
    };

    const nullstillSøknadBarnetilsyn = (person: IPerson, barnMedLabels: IBarn[]) => {
        settSøknad({
            ...initialState(intl),
            person: { ...person, barn: barnMedLabels },
        });
        settMellomlagretBarnetilsyn(undefined);
    };

    const settDokumentasjonsbehovForBarn = (
        spørsmål: ISpørsmål,
        valgtSvar: ISvar,
        barneid: string,
        barnepassid?: string
    ) => {
        let endretDokumentasjonsbehov = søknad.dokumentasjonsbehov;
        if (spørsmål.flersvar) {
            console.error('Ikke implementert');
        } else {
            endretDokumentasjonsbehov = oppdaterDokumentasjonTilEtSvarSpørsmålForBarn(
                søknad.dokumentasjonsbehov,
                spørsmål,
                valgtSvar,
                intl,
                barneid,
                barnepassid
            );
        }

        settSøknad(prevSoknad => {
            return {
                ...prevSoknad,
                dokumentasjonsbehov: endretDokumentasjonsbehov,
            };
        });
    };

    const settDokumentasjonsbehov = (spørsmål: ISpørsmål, valgtSvar: ISvar, erHuketAv?: boolean) => {
        let endretDokumentasjonsbehov = søknad.dokumentasjonsbehov;

        if (spørsmål.flersvar) {
            endretDokumentasjonsbehov = hentDokumentasjonTilFlersvarSpørsmål(
                erHuketAv,
                søknad.dokumentasjonsbehov,
                valgtSvar,
                intl
            );
        } else {
            endretDokumentasjonsbehov = oppdaterDokumentasjonTilEtSvarSpørsmål(
                søknad.dokumentasjonsbehov,
                spørsmål,
                valgtSvar,
                intl
            );
        }

        settSøknad(prevSoknad => {
            return {
                ...prevSoknad,
                dokumentasjonsbehov: endretDokumentasjonsbehov,
            };
        });
    };

    const oppdaterBarnISøknaden = (oppdatertBarn: IBarn) => {
        settSøknad(prevSøknad => ({
            ...prevSøknad,
            person: {
                ...prevSøknad.person,
                barn: oppdaterBarnIBarneliste(prevSøknad.person.barn, oppdatertBarn),
            },
        }));
    };

    const oppdaterFlereBarnISøknaden = (oppdaterteBarn: IBarn[]) => {
        settSøknad(prevSøknad => ({
            ...prevSøknad,
            person: {
                ...prevSøknad.person,
                barn: oppdaterBarneliste(prevSøknad.person.barn, oppdaterteBarn),
            },
        }));
    };

    return {
        søknad,
        settSøknad,
        settDokumentasjonsbehov,
        settDokumentasjonsbehovForBarn,
        mellomlagretBarnetilsyn,
        hentMellomlagretBarnetilsyn,
        mellomlagreBarnetilsyn,
        mellomlagreBarnetilsyn2,
        brukMellomlagretBarnetilsyn,
        nullstillMellomlagretBarnetilsyn,
        nullstillSøknadBarnetilsyn,
        oppdaterBarnISøknaden,
        oppdaterFlereBarnISøknaden,
        skalBrukeRegelendringer2026,
    };
});

export { BarnetilsynSøknadProvider, useBarnetilsynSøknad };
