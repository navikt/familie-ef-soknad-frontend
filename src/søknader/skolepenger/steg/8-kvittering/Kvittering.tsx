import { Alert, VStack } from '@navikt/ds-react';
import { useEffect } from 'react';
import Feilside from '../../../../components/feil/Feilside';
import { NavigasjonState, Side } from '../../../../components/side/Side';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import { usePersonContext } from '../../../../context/PersonContext';
import { EBegrunnelse } from '../../../../models/steg/omDeg/sivilstatus';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { formatDateHour } from '../../../../utils/dato';
import { oppdaterBarnMedLabel } from '../../../../utils/søknad';
import { hentTekst } from '../../../../utils/teksthåndtering';
import { DineSaker } from '../../../felles/steg/9-kvittering/DineSaker';
import { ErklæringSamlivsbrudd } from '../../../felles/steg/9-kvittering/ErklæringSamlivsbrudd';
import { EttersendDokumentasjon } from '../../../felles/steg/9-kvittering/EttersendDokumentasjon';
import { RegistrerBarnIFolkeregister } from '../../../felles/steg/9-kvittering/RegistrerBarnIFolkeregister';
import { TilleggsstønaderUnderUtdanning } from '../../../felles/steg/9-kvittering/TilleggsstønaderUnderUtdanning';
import { RoutesSkolepenger } from '../../routing/routes';
import { useSkolepengerSøknad } from '../../SkolepengerContext';

const Kvittering: React.FC = () => {
    const intl = useLokalIntlContext();
    const { søknad, nullstillMellomlagretSkolepenger, nullstillSøknadSkolepenger } = useSkolepengerSøknad();
    const { person } = usePersonContext();

    useEffect(() => {
        nullstillMellomlagretSkolepenger();
        return () => {
            const barnelisteMedLabels = oppdaterBarnMedLabel(person.barn, intl);
            nullstillSøknadSkolepenger(person, barnelisteMedLabels);
        };
    }, [nullstillMellomlagretSkolepenger, nullstillSøknadSkolepenger, person, intl]);

    const mottattAlert: string =
        hentTekst('kvittering.skolepenger.alert.mottatt', intl) +
        ` ${søknad?.innsendingsdato && formatDateHour(søknad?.innsendingsdato)} `;

    const erklæringSamlivsbrudd = søknad.sivilstatus.årsakEnslig?.svarid === EBegrunnelse.samlivsbruddForeldre;

    return søknad.innsendingsdato ? (
        <Side
            stønadstype={Stønadstype.skolepenger}
            stegtittel={hentTekst('kvittering.takk', intl)}
            navigasjonState={NavigasjonState.skjulKnapper}
            routesStønad={RoutesSkolepenger}
            skalViseStegindikator={false}
        >
            <VStack gap={'space-64'}>
                <Alert size="small" variant="success">
                    {mottattAlert}
                </Alert>
                <DineSaker />
                {søknad.dokumentasjonsbehov.length > 0 && (
                    <EttersendDokumentasjon stønadstype={Stønadstype.overgangsstønad} />
                )}
                {erklæringSamlivsbrudd && <ErklæringSamlivsbrudd />}
                <RegistrerBarnIFolkeregister barna={søknad.person.barn} />
                {søknad.utdanning && <TilleggsstønaderUnderUtdanning stønadstype={Stønadstype.skolepenger} />}
            </VStack>
        </Side>
    ) : (
        <Feilside />
    );
};

export default Kvittering;
