import { BodyShort, VStack } from '@navikt/ds-react';
import React, { type FC } from 'react';
import { useLocation } from 'react-router';
import { BarneHeader } from '../../../../components/barneheader/BarneHeader';
import { NavigasjonState, Side } from '../../../../components/side/Side';
import NårSøkerDuStønadFra from '../../../../components/stegKomponenter/NårSøkerDuStønadFraGruppe';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import type { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import type { IBarn } from '../../../../models/steg/barn';
import { ESøkerFraBestemtMåned } from '../../../../models/steg/dinsituasjon/meromsituasjon';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { dagensDato, datoTilStreng, formatMånederTilbake } from '../../../../utils/dato';
import { kommerFraOppsummeringen } from '../../../../utils/locationState';
import { hentTekst, hentTekstMedEnVariabel } from '../../../../utils/teksthåndtering';
import { useBarnetilsynSøknad } from '../../BarnetilsynContext';
import type { IBarnepass } from '../../models/barnepass';
import { useBarnetilsynRoutes } from '../../routing/useBarnetilsynRoutes';
import { pathOppsummeringBarnetilsyn } from '../../utils';
import { SøkerDuStønadFraBestemtMndSpm } from './BarnepassConfig';
import { useBarnepass } from './BarnepassContext';
import { BarnepassOrdninger } from './BarnepassOrdninger';
import {
    erBarnepassForAlleBarnUtfylt,
    erBarnepassForBarnFørNåværendeUtfylt,
    erBarnepassStegFerdigUtfylt,
    erÅrsakBarnepassSpmBesvart,
    skalDokumentereTidligereFakturaer,
    skalViseÅrsakBarnepass,
} from './hjelper';
import { ÅrsakBarnepass } from './ÅrsakBarnepass';

export const Barnepass: FC = () => {
    const intl = useLokalIntlContext();
    const location = useLocation();
    const { routes } = useBarnetilsynRoutes();
    const kommerFraOppsummering = kommerFraOppsummeringen(location.state);
    const navigasjonState = kommerFraOppsummering
        ? NavigasjonState.visTilbakeTilOppsummeringKnapp
        : NavigasjonState.visTilbakeNesteAvbrytKnapp;
    const {
        søknadsdato,
        settSøknadsdato,
        søkerFraBestemtMåned,
        settSøkerFraBestemtMåned,
        barn,
        settBarn,
        mellomlagreSteg,
    } = useBarnepass();
    const { skalBrukeRegelendringer2026 } = useBarnetilsynSøknad();
    const barnSomSkalHaBarnepass = barn.filter((barn: IBarn) => barn.skalHaBarnepass?.verdi);

    const datovelgerLabel = 'søkerStønadFraBestemtMnd.datovelger.barnepass';

    const hjelpetekstInnholdSøkerFraMndTekstDel1 = hentTekstMedEnVariabel(
        'søkerFraBestemtMåned.hjelpetekst-innhold.barnepass-del1',
        intl,
        formatMånederTilbake(dagensDato, 3)
    );

    const hjelpetekstInnholdSøkerFraMndTekstDel2 = hentTekst(
        'søkerFraBestemtMåned.hjelpetekst-innhold.barnepass-del2',
        intl
    );

    const settBarnepass = (barnepass: IBarnepass, barnid: string) => {
        const endretBarn = barn.map((enkeltBarn: IBarn) => {
            if (enkeltBarn.id === barnid) {
                return {
                    ...enkeltBarn,
                    barnepass: barnepass,
                };
            }
            return enkeltBarn;
        });
        settBarn(endretBarn);
    };

    const oppdaterSøknadsdato = (dato: Date | null) => {
        dato !== null &&
            settSøknadsdato({
                label: hentTekst(datovelgerLabel, intl),
                verdi: datoTilStreng(dato),
            });
    };

    const oppdaterSøkerFraBestemtMåned = (spørsmål: ISpørsmål, svar: ISvar) => {
        settSøkerFraBestemtMåned({
            spørsmålid: spørsmål.søknadid,
            svarid: svar.id,
            label: hentTekst(spørsmål.tekstid, intl),
            verdi: svar.id === ESøkerFraBestemtMåned.ja,
        });
    };

    const alertTekst: string = skalDokumentereTidligereFakturaer(
        barnSomSkalHaBarnepass,
        søkerFraBestemtMåned,
        søknadsdato
    )
        ? 'barnepass.dokumentasjon.søkerStønadFraBestemtMnd'
        : '';

    return (
        <Side
            stønadstype={Stønadstype.barnetilsyn}
            stegtittel={hentTekst('barnepass.sidetittel', intl)}
            navigasjonState={navigasjonState}
            mellomlagreSteg={mellomlagreSteg}
            erSpørsmålBesvart={erBarnepassStegFerdigUtfylt(barnSomSkalHaBarnepass, søknadsdato, søkerFraBestemtMåned)}
            routesStønad={routes}
            tilbakeTilOppsummeringPath={pathOppsummeringBarnetilsyn}
        >
            <VStack gap={'space-64'}>
                {barnSomSkalHaBarnepass.map((barn: IBarn, index: number) => {
                    const visSeksjon =
                        index === 0 ||
                        erBarnepassForBarnFørNåværendeUtfylt(barn, barnSomSkalHaBarnepass, skalBrukeRegelendringer2026);
                    return (
                        visSeksjon && (
                            <React.Fragment key={barn.id}>
                                <BarneHeader barn={barn} />

                                {skalViseÅrsakBarnepass(barn, skalBrukeRegelendringer2026) && (
                                    <ÅrsakBarnepass
                                        barn={barn}
                                        settBarnepass={settBarnepass}
                                        skalBrukeRegelendringer2026={skalBrukeRegelendringer2026}
                                    />
                                )}

                                {erÅrsakBarnepassSpmBesvart(barn, skalBrukeRegelendringer2026) && (
                                    <BarnepassOrdninger barn={barn} settBarnepass={settBarnepass} indeks={index} />
                                )}
                            </React.Fragment>
                        )
                    );
                })}
            </VStack>
            {erBarnepassForAlleBarnUtfylt(barnSomSkalHaBarnepass) && (
                <NårSøkerDuStønadFra
                    spørsmål={SøkerDuStønadFraBestemtMndSpm(intl)}
                    settSøkerFraBestemtMåned={oppdaterSøkerFraBestemtMåned}
                    settDato={oppdaterSøknadsdato}
                    søkerFraBestemtMåned={søkerFraBestemtMåned}
                    valgtDato={søknadsdato}
                    datovelgerLabel={datovelgerLabel}
                    hjelpetekstInnholdTekst={
                        <div>
                            <BodyShort style={{ paddingBottom: '1rem' }}>
                                {hjelpetekstInnholdSøkerFraMndTekstDel1}
                            </BodyShort>

                            <BodyShort>{hjelpetekstInnholdSøkerFraMndTekstDel2}</BodyShort>
                        </div>
                    }
                    alertTekst={alertTekst}
                />
            )}
        </Side>
    );
};
