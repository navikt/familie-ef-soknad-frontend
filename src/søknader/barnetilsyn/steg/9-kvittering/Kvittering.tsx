import React, { useEffect } from 'react';
import Feilside from '../../../../components/feil/Feilside';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
import { formatDateHour } from '../../../../utils/dato';
import { oppdaterBarnMedLabel } from '../../../../utils/søknad';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import SykSøker from '../../../felles/steg/9-kvittering/SykSøker';
import DineSaker from '../../../felles/steg/9-kvittering/DineSaker';
import { ErIArbeid } from '../../../../models/steg/aktivitet/aktivitet';
import { useBarnetilsynSøknad } from '../../BarnetilsynContext';
import ErklæringSamlivsbrudd from '../../../felles/steg/9-kvittering/ErklæringSamlivsbrudd';
import { EBegrunnelse } from '../../../../models/steg/omDeg/sivilstatus';
import Side, { ESide } from '../../../../components/side/Side';
import { RoutesBarnetilsyn } from '../../routing/routesBarnetilsyn';
import RegistrerBarnIFolkeregister from '../../../felles/steg/9-kvittering/RegistrerBarnIFolkeregister';
import EttersendDokumentasjon from '../../../felles/steg/9-kvittering/EttersendDokumentasjon';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { usePersonContext } from '../../../../context/PersonContext';
import { hentFilePath } from '../../../../utils/språk';
import { useSpråkContext } from '../../../../context/SpråkContext';
import { logSidevisningBarnetilsyn } from '../../../../utils/amplitude';
import { useMount } from '../../../../utils/hooks';
import { IBarn } from '../../../../models/steg/barn';
import { Alert } from '@navikt/ds-react';
import { hentTekst } from '../../../../utils/teksthåndtering';

const Kvittering: React.FC = () => {
  const intl = useLokalIntlContext();
  const [locale] = useSpråkContext();
  const { søknad, nullstillMellomlagretBarnetilsyn, nullstillSøknadBarnetilsyn } =
    useBarnetilsynSøknad();
  const { person } = usePersonContext();
  const barnSomSkalHaBarnepass = søknad.person.barn.filter(
    (barn: IBarn) => barn.skalHaBarnepass?.verdi
  );

  useMount(() => logSidevisningBarnetilsyn('Kvittering'));

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
  const erklæringSamlivsbrudd =
    søknad.sivilstatus.årsakEnslig?.svarid === EBegrunnelse.samlivsbruddForeldre;

  return søknad.innsendingsdato ? (
    <Side
      stønadstype={Stønadstype.barnetilsyn}
      stegtittel={intl.formatMessage({ id: 'kvittering.takk' })}
      skalViseKnapper={ESide.skjulKnapper}
      routesStønad={RoutesBarnetilsyn}
      skalViseStegindikator={false}
    >
      <SeksjonGruppe>
        <Alert size="small" variant={'success'}>
          {mottattAlert}
        </Alert>
      </SeksjonGruppe>

      <DineSaker />
      <EttersendDokumentasjon
        dokumentasjonsbehov={søknad.dokumentasjonsbehov}
        stønadstype={Stønadstype.barnetilsyn}
      />
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
    </Side>
  ) : (
    <Feilside />
  );
};

export default Kvittering;
