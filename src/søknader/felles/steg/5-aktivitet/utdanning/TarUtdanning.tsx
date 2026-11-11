import { Heading, VStack } from '@navikt/ds-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { GyldigeDatoer } from '../../../../../components/dato/GyldigeDatoer';
import { LesMerTekst } from '../../../../../components/lesmertekst/LesMerTekst';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import {
    erDetaljertUtdanningFerdigUtfylt,
    erUnderUtdanningFerdigUtfylt,
} from '../../../../../helpers/steg/aktivitetvalidering';
import { lagTomUnderUtdanning } from '../../../../../helpers/steg/utdanning';
import { EStudieandel, type EUtdanning, type UnderUtdanning } from '../../../../../models/steg/aktivitet/utdanning';
import { Stønadstype } from '../../../../../models/søknad/stønadstyper';
import { erPeriodeGyldigOgInnenforBegrensning } from '../../../../../utils/gyldigeDatoerUtils';
import { strengErMerEnnNull } from '../../../../../utils/spørsmålogsvar';
import { hentTekst } from '../../../../../utils/teksthåndtering';
import type { DetaljertUtdanning } from '../../../../skolepenger/models/detaljertUtdanning';
import { ErUtdanningenOffentligEllerPrivat } from './ErUtdanningenOffentligEllerPrivat';
import { ErUtdanningenPåHeltidEllerDeltid } from './ErUtdanningenPåHeltidEllerDeltid';
import { MålMedUtdanningen } from './MålMedUtdanningen';
import { NårSkalDuVæreElevEllerStudent } from './NårSkalDuElevEllerStudent';
import { SkoleOgLinje } from './SkoleOgLinjeInputFelter';
import { StudieArbeidsmengde } from './StudieArbeidsmengde';
import { Studiekostnader } from './Studiekostnader';
import { TidligereUtdanning } from './TidligereUtdanning';
import { utdanningDuKanFåStønadTil, utdanningDuKanFåStønadTilSkolepenger } from './UtdanningConfig';

interface Props {
    underUtdanning?: UnderUtdanning | DetaljertUtdanning;
    oppdaterUnderUtdanning: (utdanning: UnderUtdanning | DetaljertUtdanning) => void;
    stønadstype: Stønadstype;
}

export const TarUtdanning: React.FC<Props> = ({ underUtdanning, oppdaterUnderUtdanning, stønadstype }) => {
    const intl = useLokalIntlContext();
    const skalHaDetaljertUtdanning = stønadstype === Stønadstype.skolepenger;
    const [utdanning, settUtdanning] = useState<UnderUtdanning | DetaljertUtdanning>(
        underUtdanning ? underUtdanning : lagTomUnderUtdanning()
    );

    useEffect(() => {
        oppdaterUnderUtdanning(utdanning);
    }, [utdanning]);

    useEffect(() => {
        if (utdanning.periode && !erPeriodeGyldigOgInnenforBegrensning(utdanning?.periode, GyldigeDatoer.Alle)) {
            if (utdanning.heltidEllerDeltid) {
                settUtdanning({ ...utdanning, heltidEllerDeltid: undefined });
            }
        }
    }, [utdanning]);

    const oppdaterUtdanning = (nøkkel: EUtdanning, label: string, verdi: string) => {
        underUtdanning &&
            settUtdanning({
                ...underUtdanning,
                [nøkkel]: { label: label, verdi: verdi },
            });
    };

    const søkerSkalStudereDeltid = utdanning.heltidEllerDeltid?.svarid === EStudieandel.deltid;
    const søkerSkalStudereHeltid = utdanning.heltidEllerDeltid?.svarid === EStudieandel.heltid;

    const visTidligereUtdanning = skalHaDetaljertUtdanning
        ? erDetaljertUtdanningFerdigUtfylt(utdanning)
        : erUnderUtdanningFerdigUtfylt(utdanning);

    return (
        <VStack gap={'space-64'}>
            <VStack gap={'space-8'}>
                {stønadstype === Stønadstype.overgangsstønad && (
                    <>
                        <Heading size="small" level="3" className={'sentrert'}>
                            {hentTekst('utdanning.tittel', intl)}
                        </Heading>
                        <LesMerTekst
                            åpneTekstid={utdanningDuKanFåStønadTil.headerTekstid}
                            innholdTekstid={utdanningDuKanFåStønadTil.innholdTekstid}
                        />
                    </>
                )}
                {stønadstype === Stønadstype.skolepenger && (
                    <LesMerTekst
                        åpneTekstid={utdanningDuKanFåStønadTilSkolepenger.headerTekstid}
                        innholdTekstid={utdanningDuKanFåStønadTilSkolepenger.innholdTekstid}
                    />
                )}
            </VStack>

            <SkoleOgLinje aria-live="polite" utdanning={utdanning} oppdaterUtdanning={oppdaterUtdanning} />

            {utdanning.linjeKursGrad?.verdi && (
                <ErUtdanningenOffentligEllerPrivat utdanning={utdanning} settUtdanning={settUtdanning} />
            )}
            {utdanning.offentligEllerPrivat?.verdi && (
                <NårSkalDuVæreElevEllerStudent utdanning={utdanning} settUtdanning={settUtdanning} />
            )}
            {utdanning?.periode && erPeriodeGyldigOgInnenforBegrensning(utdanning?.periode, GyldigeDatoer.Alle) && (
                <ErUtdanningenPåHeltidEllerDeltid utdanning={utdanning} settUtdanning={settUtdanning} />
            )}
            {søkerSkalStudereHeltid && (
                <MålMedUtdanningen
                    utdanning={utdanning}
                    oppdaterUtdanning={oppdaterUtdanning}
                    stønadstype={stønadstype}
                />
            )}
            {søkerSkalStudereDeltid && (
                <>
                    <StudieArbeidsmengde utdanning={utdanning} oppdaterUtdanning={oppdaterUtdanning} />
                    {strengErMerEnnNull(utdanning.arbeidsmengde?.verdi) && (
                        <MålMedUtdanningen
                            utdanning={utdanning}
                            oppdaterUtdanning={oppdaterUtdanning}
                            stønadstype={stønadstype}
                        />
                    )}
                </>
            )}
            {skalHaDetaljertUtdanning && erUnderUtdanningFerdigUtfylt(utdanning) && (
                <Studiekostnader utdanning={utdanning} oppdaterUtdanning={oppdaterUtdanning} />
            )}

            {visTidligereUtdanning && (
                <TidligereUtdanning underUtdanning={utdanning} settUnderUtdanning={settUtdanning} />
            )}
        </VStack>
    );
};
