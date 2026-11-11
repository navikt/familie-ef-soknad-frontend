import { Heading, VStack } from '@navikt/ds-react';
import { type FC, useEffect, useState } from 'react';
import LeggTilKnapp from '../../../../../components/knapper/LeggTilKnapp';
import { useLokalIntlContext } from '../../../../../context/LokalIntlContext';
import { tomPeriode } from '../../../../../helpers/tommeSøknadsfelter';
import type { ILandMedKode, IUtenlandsopphold } from '../../../../../models/steg/omDeg/medlemskap';
import { hentUid } from '../../../../../utils/autentiseringogvalidering/uuid';
import { hentTekst } from '../../../../../utils/teksthåndtering';
import { useOmDeg } from '../OmDegContext';
import { Utenlandsopphold } from './Utenlandsopphold';

export const PeriodeBoddIUtlandet: FC<{
    land: ILandMedKode[];
}> = ({ land }) => {
    const intl = useLokalIntlContext();
    const { medlemskap, settMedlemskap } = useOmDeg();
    const tomtUtenlandsopphold: IUtenlandsopphold = {
        id: hentUid(),
        periode: tomPeriode,
        erEøsLand: true,
        begrunnelse: {
            label: hentTekst('medlemskap.periodeBoddIUtlandet.begrunnelse', intl),
            verdi: '',
        },
    };
    const [perioderBoddIUtlandet, settPerioderBoddIUtlandet] = useState<IUtenlandsopphold[]>(
        medlemskap?.perioderBoddIUtlandet && medlemskap.perioderBoddIUtlandet.length > 0
            ? medlemskap.perioderBoddIUtlandet
            : [tomtUtenlandsopphold]
    );

    const erForrigePeriodeFyltUt: boolean = perioderBoddIUtlandet.every(
        utenlandsopphold => utenlandsopphold.begrunnelse.verdi !== ''
    );

    useEffect(() => {
        settMedlemskap({
            ...medlemskap,
            perioderBoddIUtlandet: perioderBoddIUtlandet,
        });
    }, [perioderBoddIUtlandet]);

    const leggTilUtenlandsperiode = () => {
        const alleUtenlandsopphold = perioderBoddIUtlandet;
        alleUtenlandsopphold && alleUtenlandsopphold.push(tomtUtenlandsopphold);
        alleUtenlandsopphold &&
            settMedlemskap({
                ...medlemskap,
                perioderBoddIUtlandet: alleUtenlandsopphold,
            });
    };

    return (
        <VStack gap="space-24">
            {perioderBoddIUtlandet.map((periode, index) => (
                <Utenlandsopphold
                    key={periode.id}
                    settPeriodeBoddIUtlandet={settPerioderBoddIUtlandet}
                    perioderBoddIUtlandet={perioderBoddIUtlandet}
                    utenlandsopphold={periode}
                    oppholdsnr={index}
                    land={land}
                />
            ))}

            {erForrigePeriodeFyltUt && (
                <VStack gap="space-24">
                    <Heading size={'xsmall'}>
                        {hentTekst('medlemskap.periodeBoddIUtlandet.flereutenlandsopphold', intl)}
                    </Heading>
                    <div>
                        <LeggTilKnapp onClick={leggTilUtenlandsperiode}>
                            {hentTekst('medlemskap.periodeBoddIUtlandet.knapp', intl)}
                        </LeggTilKnapp>
                    </div>
                </VStack>
            )}
        </VStack>
    );
};
