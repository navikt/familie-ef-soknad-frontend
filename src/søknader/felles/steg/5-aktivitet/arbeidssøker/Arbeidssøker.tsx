import { Alert, Heading, VStack } from '@navikt/ds-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { AlertStripeDokumentasjon } from '../../../../../components/AlertstripeDokumentasjon';
import JaNeiSpørsmål from '../../../../../components/spørsmål/JaNeiSpørsmål';
import MultiSvarSpørsmål from '../../../../../components/spørsmål/MultiSvarSpørsmål';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { ESvar, type ISpørsmål, type ISvar } from '../../../../../models/felles/spørsmålogsvar';
import type { IAktivitet } from '../../../../../models/steg/aktivitet/aktivitet';
import type { IArbeidssøker } from '../../../../../models/steg/aktivitet/arbeidssøker';
import { hentBooleanFraValgtSvar } from '../../../../../utils/spørsmålogsvar';
import { hentSvarAlertFraSpørsmål } from '../../../../../utils/søknad';
import { hentTekst } from '../../../../../utils/teksthåndtering';
import {
    erSøkerArbeidssøker,
    erVilligTilÅTaImotTilbud,
    kanBegynneInnenEnUke,
    ønskerHalvStilling,
    ønsketArbeidssted,
} from './ArbeidssøkerConfig';

interface Props {
    arbeidssituasjon: IAktivitet;
    settArbeidssituasjon: (nyArbeidssituasjon: IAktivitet) => void;
    settDokumentasjonsbehov: (spørsmål: ISpørsmål, valgtSvar: ISvar, erHuketAv?: boolean) => void;
}

export const Arbeidssøker: React.FC<Props> = ({ arbeidssituasjon, settArbeidssituasjon, settDokumentasjonsbehov }) => {
    const intl = useLokalIntlContext();
    const [arbeidssøker, settArbeidssøker] = useState<IArbeidssøker>(
        arbeidssituasjon.arbeidssøker ? arbeidssituasjon.arbeidssøker : {}
    );

    useEffect(() => {
        settArbeidssituasjon({ ...arbeidssituasjon, arbeidssøker: arbeidssøker });
    }, [arbeidssøker]);

    const settJaNeiSpørsmål = (spørsmål: ISpørsmål, valgtSvar: ISvar) => {
        const svar: boolean = hentBooleanFraValgtSvar(valgtSvar);

        settArbeidssøker({
            ...arbeidssøker,
            [spørsmål.søknadid]: {
                spørsmålid: spørsmål.søknadid,
                svarid: valgtSvar.id,
                label: hentTekst(spørsmål.tekstid, intl),
                verdi: svar,
            },
        });

        settDokumentasjonsbehov(spørsmål, valgtSvar);
    };

    const settMultiSvarSpørsmål = (spørsmål: ISpørsmål, svar: ISvar) => {
        settArbeidssøker({
            ...arbeidssøker,
            [spørsmål.søknadid]: {
                label: hentTekst(spørsmål.tekstid, intl),
                verdi: svar.svar_tekst,
            },
        });
    };

    const registrertSomArbeidssøkerAlert = hentSvarAlertFraSpørsmål(ESvar.NEI, erSøkerArbeidssøker(intl));

    return (
        <VStack gap={'space-64'}>
            <Heading size="small" level="3" align={'center'}>
                {hentTekst('arbeidssøker.tittel', intl)}
            </Heading>

            <VStack gap={'space-8'}>
                <JaNeiSpørsmål
                    spørsmål={erSøkerArbeidssøker(intl)}
                    onChange={settJaNeiSpørsmål}
                    valgtSvar={arbeidssøker.registrertSomArbeidssøkerNav?.verdi}
                />
                {arbeidssøker.registrertSomArbeidssøkerNav?.svarid === ESvar.NEI && (
                    <Alert size="small" variant="info" inline>
                        {hentTekst(registrertSomArbeidssøkerAlert, intl)}
                    </Alert>
                )}
            </VStack>

            {arbeidssøker.registrertSomArbeidssøkerNav && (
                <VStack gap={'space-8'}>
                    <JaNeiSpørsmål
                        spørsmål={erVilligTilÅTaImotTilbud(intl)}
                        onChange={settJaNeiSpørsmål}
                        valgtSvar={arbeidssøker.villigTilÅTaImotTilbudOmArbeid?.verdi}
                    />
                    {arbeidssøker.villigTilÅTaImotTilbudOmArbeid?.svarid === ESvar.NEI && (
                        <AlertStripeDokumentasjon>
                            {hentTekst('arbeidssøker.alert.villig', intl)}
                        </AlertStripeDokumentasjon>
                    )}
                </VStack>
            )}
            {arbeidssøker.villigTilÅTaImotTilbudOmArbeid && (
                <VStack gap={'space-8'}>
                    <JaNeiSpørsmål
                        spørsmål={kanBegynneInnenEnUke(intl)}
                        onChange={settJaNeiSpørsmål}
                        valgtSvar={arbeidssøker.kanBegynneInnenEnUke?.verdi}
                    />
                    {arbeidssøker.kanBegynneInnenEnUke?.svarid === ESvar.NEI && (
                        <Alert size="small" variant={'warning'} inline>
                            {hentTekst('arbeidssøker.alert.senestEnUke', intl)}
                        </Alert>
                    )}
                </VStack>
            )}

            {arbeidssøker.kanBegynneInnenEnUke && (
                <MultiSvarSpørsmål
                    spørsmål={ønsketArbeidssted(intl)}
                    settSpørsmålOgSvar={settMultiSvarSpørsmål}
                    valgtSvar={arbeidssøker.hvorØnskerSøkerArbeid?.verdi}
                />
            )}
            {arbeidssøker.hvorØnskerSøkerArbeid && (
                <VStack gap={'space-8'}>
                    <JaNeiSpørsmål
                        spørsmål={ønskerHalvStilling(intl)}
                        onChange={settJaNeiSpørsmål}
                        valgtSvar={arbeidssøker.ønskerSøker50ProsentStilling?.verdi}
                    />
                    {arbeidssøker.ønskerSøker50ProsentStilling?.svarid === ESvar.NEI && (
                        <Alert size="small" variant={'warning'} inline>
                            {hentTekst('arbeidssøker.alert.halvstilling', intl)}
                        </Alert>
                    )}
                </VStack>
            )}
        </VStack>
    );
};
