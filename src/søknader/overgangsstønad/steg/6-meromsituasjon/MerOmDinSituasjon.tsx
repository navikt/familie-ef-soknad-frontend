import { VStack } from '@navikt/ds-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { NavigasjonState, Side } from '../../../../components/side/Side';
import { CheckboxSpørsmål } from '../../../../components/spørsmål/CheckboxSpørsmål';
import NårSøkerDuStønadFra from '../../../../components/stegKomponenter/NårSøkerDuStønadFraGruppe';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import type { ISpørsmål, ISvar } from '../../../../models/felles/spørsmålogsvar';
import { ESøkerFraBestemtMåned, type IDinSituasjon } from '../../../../models/steg/dinsituasjon/meromsituasjon';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { datoTilStreng } from '../../../../utils/dato';
import { useLeggTilSærligeBehovHvisHarEttBarMedSærligeBehov } from '../../../../utils/hooks';
import { kommerFraOppsummeringen } from '../../../../utils/locationState';
import { returnerAvhukedeSvar } from '../../../../utils/spørsmålogsvar';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { gjelderNoeAvDetteDeg, SøkerFraBestemtMånedSpm } from '../../../felles/steg/6-meromsituasjon/SituasjonConfig';
import { SituasjonOppfølgingSpørsmål } from '../../../felles/steg/6-meromsituasjon/SituasjonOppfølgingSpørsmål';
import {
    harSøkerMindreEnnHalvStilling,
    harValgtSvarPåSagtOppEllerRedusertArbeidstidSpørsmål,
    hvisHarBarnMedSærligeTilsynMåHaFyltUtFritekst,
} from '../../../felles/steg/6-meromsituasjon/SituasjonUtil';
import type { SøknadOvergangsstønad } from '../../models/søknad';
import { useOvergangsstønadSøknad } from '../../OvergangsstønadContext';
import { RoutesOvergangsstonad } from '../../routing/routesOvergangsstonad';
import { pathOppsummeringOvergangsstønad } from '../../utils';
import { HarSøkerSagtOppEllerRedusertStilling } from './HarSøkerSagtOppEllerRedusertStilling';
import { HjelpetekstSøkerFraBestemtMåned } from './HjelpetekstSøkerFraBestemtMåned';

const MerOmDinSituasjon: React.FC = () => {
    const intl = useLokalIntlContext();
    const { søknad, settSøknad, settDokumentasjonsbehov, mellomlagreOvergangsstønad, oppdaterBarnISøknaden } =
        useOvergangsstønadSøknad();
    const location = useLocation();
    const kommerFraOppsummering = kommerFraOppsummeringen(location.state);
    const navigasjonState = kommerFraOppsummering
        ? NavigasjonState.visTilbakeTilOppsummeringKnapp
        : NavigasjonState.visTilbakeNesteAvbrytKnapp;
    const [dinSituasjon, settDinSituasjon] = useState<IDinSituasjon>(søknad.merOmDinSituasjon);
    const { gjelderDetteDeg, søknadsdato, søkerFraBestemtMåned } = dinSituasjon;
    const søkerJobberMindreEnnFemtiProsent = harSøkerMindreEnnHalvStilling(søknad);

    const datovelgerLabel = 'søkerFraBestemtMåned.datovelger.overgangsstønad';

    useEffect(() => {
        settSøknad((prevSøknad: SøknadOvergangsstønad) => ({
            ...prevSøknad,
            merOmDinSituasjon: dinSituasjon,
        }));
    }, [dinSituasjon, settSøknad]);

    useLeggTilSærligeBehovHvisHarEttBarMedSærligeBehov(søknad, intl, oppdaterBarnISøknaden);

    const settDinSituasjonFelt = (spørsmål: ISpørsmål, svarHuketAv: boolean, svar: ISvar) => {
        const spørsmålTekst = hentTekst(spørsmål.tekstid, intl);
        const { avhukedeSvar, svarider } = returnerAvhukedeSvar(dinSituasjon.gjelderDetteDeg, svarHuketAv, svar);

        settDinSituasjon({
            ...dinSituasjon,
            gjelderDetteDeg: {
                spørsmålid: spørsmål.søknadid,
                svarid: svarider,
                label: spørsmålTekst,
                verdi: avhukedeSvar,
                alternativer: dinSituasjon.gjelderDetteDeg.alternativer,
            },
        });
        settDokumentasjonsbehov(spørsmål, svar, svarHuketAv);
    };

    const settSøknadsdato = (dato: Date | null) => {
        dato !== null &&
            settDinSituasjon({
                ...dinSituasjon,
                søknadsdato: {
                    label: hentTekst(datovelgerLabel, intl),
                    verdi: datoTilStreng(dato),
                },
            });
    };

    const settSøkerFraBestemtMåned = (spørsmål: ISpørsmål, svar: ISvar) => {
        settDinSituasjon({
            ...dinSituasjon,
            [spørsmål.søknadid]: {
                spørsmålid: spørsmål.søknadid,
                svarid: svar.id,
                label: hentTekst(spørsmål.tekstid, intl),
                verdi: svar.id === ESøkerFraBestemtMåned.ja,
            },
            søknadsdato: svar.id === ESøkerFraBestemtMåned.neiNavKanVurdere ? undefined : dinSituasjon.søknadsdato,
        });
    };

    const harValgtMinstEttAlternativ = gjelderDetteDeg.svarid.length !== 0;

    const visNårSøkerDuStønadFra = søkerJobberMindreEnnFemtiProsent
        ? harValgtMinstEttAlternativ &&
          harValgtSvarPåSagtOppEllerRedusertArbeidstidSpørsmål(dinSituasjon) &&
          hvisHarBarnMedSærligeTilsynMåHaFyltUtFritekst(søknad)
        : harValgtMinstEttAlternativ && hvisHarBarnMedSærligeTilsynMåHaFyltUtFritekst(søknad);

    const erAlleSpørsmålBesvart =
        søknadsdato?.verdi !== undefined || søkerFraBestemtMåned?.svarid === ESøkerFraBestemtMåned.neiNavKanVurdere;

    return (
        <Side
            stønadstype={Stønadstype.overgangsstønad}
            stegtittel={hentTekst('stegtittel.dinSituasjon', intl)}
            navigasjonState={navigasjonState}
            erSpørsmålBesvart={erAlleSpørsmålBesvart}
            mellomlagreStønad={mellomlagreOvergangsstønad}
            routesStønad={RoutesOvergangsstonad}
            tilbakeTilOppsummeringPath={pathOppsummeringOvergangsstønad}
        >
            <VStack gap={'space-64'}>
                <CheckboxSpørsmål
                    spørsmål={gjelderNoeAvDetteDeg(intl)}
                    settValgteSvar={settDinSituasjonFelt}
                    valgteSvar={søknad.merOmDinSituasjon.gjelderDetteDeg.verdi}
                />
                {dinSituasjon.gjelderDetteDeg.svarid.map((svarid, index) => {
                    const harValgtMinstEttAlternativ = gjelderDetteDeg.svarid.length !== 0;

                    return harValgtMinstEttAlternativ && <SituasjonOppfølgingSpørsmål key={index} svarid={svarid} />;
                })}

                {søkerJobberMindreEnnFemtiProsent &&
                    harValgtMinstEttAlternativ &&
                    hvisHarBarnMedSærligeTilsynMåHaFyltUtFritekst(søknad) && (
                        <HarSøkerSagtOppEllerRedusertStilling
                            dinSituasjon={dinSituasjon}
                            settDinSituasjon={settDinSituasjon}
                        />
                    )}
                {visNårSøkerDuStønadFra && (
                    <NårSøkerDuStønadFra
                        spørsmål={SøkerFraBestemtMånedSpm(intl)}
                        settSøkerFraBestemtMåned={settSøkerFraBestemtMåned}
                        søkerFraBestemtMåned={dinSituasjon.søkerFraBestemtMåned}
                        settDato={settSøknadsdato}
                        valgtDato={dinSituasjon.søknadsdato}
                        datovelgerLabel={datovelgerLabel}
                        hjelpetekstInnholdTekst={<HjelpetekstSøkerFraBestemtMåned />}
                    />
                )}
            </VStack>
        </Side>
    );
};

export default MerOmDinSituasjon;
