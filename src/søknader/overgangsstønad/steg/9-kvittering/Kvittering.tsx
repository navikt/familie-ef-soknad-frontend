import { useEffect } from 'react';
import DineSaker from '../../../felles/steg/9-kvittering/DineSaker';
import Feilside from '../../../../components/feil/Feilside';
import RegistrerDegSomArbeidssøker from '../../../felles/steg/9-kvittering/RegistrerDegSomArbeidssøker';
import SeksjonGruppe from '../../../../components/gruppe/SeksjonGruppe';
import TilleggsstønaderArbeidssøker from '../../../felles/steg/9-kvittering/TilleggsstønaderArbeidssøker';
import TilleggsstønaderHarAktivitet from '../../../felles/steg/9-kvittering/TilleggsstønaderHarAktivitet';
import TilleggsstønaderUnderUtdanning from '../../../felles/steg/9-kvittering/TilleggsstønaderUnderUtdanning';
import { ESvar } from '../../../../models/felles/spørsmålogsvar';
import { formatDateHour } from '../../../../utils/dato';
import { oppdaterBarnMedLabel } from '../../../../utils/søknad';
import { useLokalIntlContext } from '../../../../context/LokalIntlContext';
import SyktBarn from '../../../felles/steg/9-kvittering/SyktBarn';
import { useOvergangsstønadSøknad } from '../../OvergangsstønadContext';
import { DinSituasjonType } from '../../../../models/steg/dinsituasjon/meromsituasjon';
import SykSøker from '../../../felles/steg/9-kvittering/SykSøker';
import ErklæringSamlivsbrudd from '../../../felles/steg/9-kvittering/ErklæringSamlivsbrudd';
import { EBegrunnelse } from '../../../../models/steg/omDeg/sivilstatus';
import { Side, NavigasjonState } from '../../../../components/side/Side';
import { RoutesOvergangsstonad } from '../../routing/routesOvergangsstonad';
import RegistrerBarnIFolkeregister from '../../../felles/steg/9-kvittering/RegistrerBarnIFolkeregister';
import EttersendDokumentasjon from '../../../felles/steg/9-kvittering/EttersendDokumentasjon';
import { Stønadstype } from '../../../../models/søknad/stønadstyper';
import { usePersonContext } from '../../../../context/PersonContext';
import { useSpråkContext } from '../../../../context/SpråkContext';
import { hentFilePath } from '../../../../utils/språk';
import { Alert } from '@navikt/ds-react';
import { hentTekst } from '../../../../utils/teksthåndtering';

const Kvittering: React.FC = () => {
  const intl = useLokalIntlContext();
  const { søknad, nullstillMellomlagretOvergangsstønad, nullstillSøknadOvergangsstønad } =
    useOvergangsstønadSøknad();

  const { person } = usePersonContext();
  const [locale] = useSpråkContext();
  const { arbeidssøker, underUtdanning, arbeidsforhold, firmaer, egetAS, etablererEgenVirksomhet } =
    søknad.aktivitet;

  useEffect(() => {
    nullstillMellomlagretOvergangsstønad();
    return () => {
      const barnelisteMedLabels = oppdaterBarnMedLabel(person.barn, intl);
      nullstillSøknadOvergangsstønad(person, barnelisteMedLabels);
    };
  }, [nullstillMellomlagretOvergangsstønad, nullstillSøknadOvergangsstønad, person, intl]);

  const mottattAlert: string =
    hentTekst('kvittering.alert.mottatt', intl) +
    ` ${søknad?.innsendingsdato && formatDateHour(søknad?.innsendingsdato)} `;

  const syktBarn = søknad.merOmDinSituasjon?.gjelderDetteDeg.svarid.includes(
    DinSituasjonType.harSyktBarn
  );

  const sykSøker = søknad.merOmDinSituasjon?.gjelderDetteDeg.svarid.includes(
    DinSituasjonType.erSyk
  );

  const erklæringSamlivsbrudd =
    søknad.sivilstatus.årsakEnslig?.svarid === EBegrunnelse.samlivsbruddForeldre;

  return søknad.innsendingsdato ? (
    <Side
      stønadstype={Stønadstype.overgangsstønad}
      stegtittel={hentTekst('kvittering.takk', intl)}
      navigasjonState={NavigasjonState.skjulKnapper}
      routesStønad={RoutesOvergangsstonad}
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
      {arbeidssøker?.registrertSomArbeidssøkerNav?.svarid === ESvar.NEI && (
        <RegistrerDegSomArbeidssøker />
      )}

      {syktBarn && <SyktBarn />}
      {sykSøker && (
        <SykSøker
          filPath={hentFilePath(locale, {
            nb: '/familie/alene-med-barn/soknad/filer/Huskeliste_lege_syk_OS.pdf',
            en: '/familie/alene-med-barn/soknad/filer/Checklist_for_your_doctors_appointment_OS_EN.pdf',
            nn: '/familie/alene-med-barn/soknad/filer/Hugseliste_lege_sjukdom_OS_NN.pdf',
          })}
        />
      )}

      {erklæringSamlivsbrudd && <ErklæringSamlivsbrudd />}
      <RegistrerBarnIFolkeregister barna={søknad.person.barn} />

      {arbeidssøker && <TilleggsstønaderArbeidssøker />}

      {underUtdanning && (
        <TilleggsstønaderUnderUtdanning stønadstype={Stønadstype.overgangsstønad} />
      )}
      {(arbeidsforhold || firmaer || etablererEgenVirksomhet || egetAS) && (
        <TilleggsstønaderHarAktivitet />
      )}
    </Side>
  ) : (
    <Feilside />
  );
};

export default Kvittering;
