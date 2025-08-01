import { useEffect } from 'react';
import DineSaker from '../../../felles/steg/9-kvittering/DineSaker';
import Feilside from '../../../../components/feil/Feilside';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
import TilleggsstønaderUnderUtdanning from '../../../felles/steg/9-kvittering/TilleggsstønaderUnderUtdanning';
import { formatDateHour } from '../../../../utils/dato';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import ErklæringSamlivsbrudd from '../../../felles/steg/9-kvittering/ErklæringSamlivsbrudd';
import { EBegrunnelse } from '../../../../models/steg/omDeg/sivilstatus';
import { Side, StegNavigasjonState } from '../../../../components/side/Side';
import { RoutesSkolepenger } from '../../routing/routes';
import RegistrerBarnIFolkeregister from '../../../felles/steg/9-kvittering/RegistrerBarnIFolkeregister';
import EttersendDokumentasjon from '../../../felles/steg/9-kvittering/EttersendDokumentasjon';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { useSkolepengerSøknad } from '../../SkolepengerContext';
import { usePersonContext } from '../../../../context/PersonContext';
import { logSidevisningSkolepenger } from '../../../../utils/amplitude';
import { useMount } from '../../../../utils/hooks';
import { Alert } from '@navikt/ds-react';
import { oppdaterBarnMedLabel } from '../../../../utils/søknad';
import { hentTekst } from '../../../../utils/teksthåndtering';

const Kvittering: React.FC = () => {
  const intl = useLokalIntlContext();
  const { søknad, nullstillMellomlagretSkolepenger, nullstillSøknadSkolepenger } =
    useSkolepengerSøknad();
  const { person } = usePersonContext();

  useMount(() => logSidevisningSkolepenger('Kvittering'));

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

  const erklæringSamlivsbrudd =
    søknad.sivilstatus.årsakEnslig?.svarid === EBegrunnelse.samlivsbruddForeldre;

  return søknad.innsendingsdato ? (
    <Side
      stønadstype={Stønadstype.skolepenger}
      stegtittel={hentTekst('kvittering.takk', intl)}
      skalViseKnapper={StegNavigasjonState.skjulKnapper}
      routesStønad={RoutesSkolepenger}
      skalViseStegindikator={false}
    >
      <SeksjonGruppe>
        <Alert size="small" variant="success">
          {mottattAlert}
        </Alert>
      </SeksjonGruppe>
      <DineSaker />
      <EttersendDokumentasjon
        dokumentasjonsbehov={søknad.dokumentasjonsbehov}
        stønadstype={Stønadstype.overgangsstønad}
      />
      {erklæringSamlivsbrudd && <ErklæringSamlivsbrudd />}
      <RegistrerBarnIFolkeregister barna={søknad.person.barn} />
      {søknad.utdanning && <TilleggsstønaderUnderUtdanning stønadstype={Stønadstype.skolepenger} />}
    </Side>
  ) : (
    <Feilside />
  );
};

export default Kvittering;
