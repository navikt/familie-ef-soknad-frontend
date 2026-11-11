import { Alert, VStack } from '@navikt/ds-react';
import type React from 'react';
import { useEffect } from 'react';
import Feilside from '../../../../components/feil/Feilside';
import { NavigasjonState, Side } from '../../../../components/side/Side';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { usePersonContext } from '../../../../context/PersonContext';
import { useSpråkContext } from '../../../../context/SpråkContext';
import { ErIArbeid } from '../../../../models/steg/aktivitet/aktivitet';
import type { IBarn } from '../../../../models/steg/barn';
import { EBegrunnelse } from '../../../../models/steg/omDeg/sivilstatus';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { formatDateHour } from '../../../../utils/dato';
import { hentFilePath } from '../../../../utils/språk';
import { oppdaterBarnMedLabel } from '../../../../utils/søknad';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { DineSaker } from '../../../felles/steg/9-kvittering/DineSaker';
import { ErklæringSamlivsbrudd } from '../../../felles/steg/9-kvittering/ErklæringSamlivsbrudd';
import { EttersendDokumentasjon } from '../../../felles/steg/9-kvittering/EttersendDokumentasjon';
import { RegistrerBarnIFolkeregister } from '../../../felles/steg/9-kvittering/RegistrerBarnIFolkeregister';
import { SykSøker } from '../../../felles/steg/9-kvittering/SykSøker';
import { useBarnetilsynSøknad } from '../../BarnetilsynContext';
import { useBarnetilsynRoutes } from '../../routing/useBarnetilsynRoutes';

const Kvittering: React.FC = () => {
    const intl = useLokalIntlContext();
    const [locale] = useSpråkContext();
    const { søknad, nullstillMellomlagretBarnetilsyn, nullstillSøknadBarnetilsyn } = useBarnetilsynSøknad();
    const { person } = usePersonContext();
    const { routes } = useBarnetilsynRoutes();
    const barnSomSkalHaBarnepass = søknad.person.barn.filter((barn: IBarn) => barn.skalHaBarnepass?.verdi);

    useEffect(() => {
        nullstillMellomlagretBarnetilsyn();
        return () => {
            const barnelisteMedLabels = oppdaterBarnMedLabel(person.barn, intl);
            nullstillSøknadBarnetilsyn(person, barnelisteMedLabels);
        };
    }, [nullstillMellomlagretBarnetilsyn, nullstillSøknadBarnetilsyn, person, intl]);

    const mottattAlert: string =
        hentTekst('kvittering.barnetilsyn.alert.mottatt', intl) +
        ` ${søknad?.innsendingsdato && formatDateHour(søknad?.innsendingsdato)} `;

    const sykSøker = søknad.aktivitet?.erIArbeid?.svarid === ErIArbeid.NeiFordiJegErSyk;
    const erklæringSamlivsbrudd = søknad.sivilstatus.årsakEnslig?.svarid === EBegrunnelse.samlivsbruddForeldre;

    return søknad.innsendingsdato ? (
        <Side
            stønadstype={Stønadstype.barnetilsyn}
            stegtittel={hentTekst('kvittering.takk', intl)}
            navigasjonState={NavigasjonState.skjulKnapper}
            routesStønad={routes}
            skalViseStegindikator={false}
        >
            <VStack gap={'space-64'}>
                <Alert size="small" variant={'success'}>
                    {mottattAlert}
                </Alert>
                <DineSaker />
                {søknad.dokumentasjonsbehov.length > 0 && (
                    <EttersendDokumentasjon stønadstype={Stønadstype.barnetilsyn} />
                )}
                {sykSøker && (
                    <SykSøker
                        filPath={hentFilePath(locale, {
                            nb: '/familie/alene-med-barn/soknad/filer/Huskeliste_lege_syk_BT.pdf',
                            en: '/familie/alene-med-barn/soknad/filer/Checklist_for_your_doctors_appointment_BT_EN.pdf',
                            nn: '/familie/alene-med-barn/soknad/filer/Hugseliste_lege_sjukdom_BT_NN.pdf',
                        })}
                    />
                )}
                {erklæringSamlivsbrudd && <ErklæringSamlivsbrudd />}

                <RegistrerBarnIFolkeregister barna={barnSomSkalHaBarnepass} />
            </VStack>
        </Side>
    ) : (
        <Feilside />
    );
};

export default Kvittering;
