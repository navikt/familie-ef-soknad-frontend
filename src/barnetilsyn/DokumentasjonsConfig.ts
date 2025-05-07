import {
  AdresseopplysningerDokumentasjon,
  AktivitetDokumentasjon,
  BarnasBostedDokumentasjon,
  BarnDokumentasjon,
  BarnetilsynDokumentasjon,
  BosituasjonDokumentasjon,
  IDokumentasjon,
  OmDegDokumentasjon,
  SituasjonDokumentasjon,
} from '../models/steg/dokumentasjon';
import { EArbeidssøker } from '../models/steg/aktivitet/arbeidssøker';
import { ESvar } from '../models/felles/spørsmålogsvar';
import {
  EAktivitet,
  EArbeidssituasjon,
} from '../models/steg/aktivitet/aktivitet';
import { EUtdanning } from '../models/steg/aktivitet/utdanning';
import {
  DinSituasjonType,
  ESagtOppEllerRedusertStilling,
  ESituasjon,
} from '../models/steg/dinsituasjon/meromsituasjon';
import {
  EArbeidsgiver,
  EStilling,
} from '../models/steg/aktivitet/arbeidsgiver';
import { EBarn } from '../models/steg/barn';
import {
  EBarnepass,
  ETypeBarnepassOrdning,
  EÅrsakBarnepass,
} from './models/barnepass';
import { EBosituasjon, ESøkerDelerBolig } from '../models/steg/bosituasjon';
import { EForelder } from '../models/steg/forelder';
import {
  EHarSkriftligSamværsavtale,
  ESkalBarnetBoHosSøker,
} from '../models/steg/barnasbosted';
import {
  EBegrunnelse,
  ESivilstatusSøknadid,
} from '../models/steg/omDeg/sivilstatus';
import { EAdresseopplysninger } from '../models/steg/adresseopplysninger';

type IDokumentasjonsConfig = {
  [key in DokumentasjonsConfigKey]: IDokumentasjon;
};

type DokumentasjonsConfigKey =
  | 'DokumentasjonIkkeVilligTilArbeid'
  | 'DokumentasjonSyk'
  | 'DokumentasjonOmVirksomhetenDuEtablerer'
  | 'DokumentasjonUtgifterUtdanning'
  | 'DokumentasjonUtdanning'
  | 'DokumentasjonArbeidskontrakt'
  | 'DokumentasjonLærling'
  | 'Terminbekreftelse'
  | 'FakturaFraBarnepassordning'
  | 'AvtaleMedBarnepasser'
  | 'DokumentasjonTrengerMerPassEnnJevnaldrede'
  | 'DokumentasjonUtenomVanligArbeidstid'
  | 'DokumentasjonMyeBortePgaJobb'
  | 'DokumentasjonBorPåUlikeAdresser'
  | 'DokumentasjonBarnBorHosDeg'
  | 'SamværsavtaleMedKonkreteTidspunkter'
  | 'SamværsavtaleUtenKonkreteTidspunkter'
  | 'DokumentasjonSykdom'
  | 'DokumentasjonSyktBarn'
  | 'DokumentasjonBarnepassMangel'
  | 'DokumentasjonBarnetilsynBehov'
  | 'ArbeidsforholdOgOppsigelsesårsak'
  | 'ArbeidsforholdOgRedusertArbeidstid'
  | 'ErklæringSamlivsbrudd'
  | 'DokumentasjonInngåttEkteskap'
  | 'DokumentasjonUformeltSeparertEllerSkilt'
  | 'MeldtAdresseendring'
  | 'BekreftelseSeparasjonSøknad';

export const DokumentasjonsConfig: IDokumentasjonsConfig = {
  //AktivitetsConfig
  DokumentasjonIkkeVilligTilArbeid: {
    id: SituasjonDokumentasjon.IKKE_VILLIG_TIL_ARBEID,
    spørsmålid: EArbeidssøker.villigTilÅTaImotTilbudOmArbeid,
    svarid: ESvar.NEI,
    label: '',
    tittel: 'dokumentasjon.ikke.villig.til.arbeid.tittel',
    beskrivelse: 'dokumentasjon.ikke.villig.til.arbeid.beskrivelse',
    harSendtInn: false,
  },
  DokumentasjonSyk: {
    id: AktivitetDokumentasjon.FOR_SYK_TIL_Å_JOBBE,
    spørsmålid: EArbeidssituasjon.erDuIArbeid,
    svarid: ESvar.NEI,
    label: '',
    tittel: 'dokumentasjon.syk-arbeid.tittel',
    beskrivelse: 'dokumentasjon.syk-arbeid.beskrivelse',
    harSendtInn: false,
  },
  DokumentasjonOmVirksomhetenDuEtablerer: {
    id: AktivitetDokumentasjon.ETABLERER_VIRKSOMHET,
    spørsmålid: EArbeidssituasjon.hvaErDinArbeidssituasjon,
    svarid: EAktivitet.etablererEgenVirksomhet,
    label: '',
    tittel: 'dokumentasjon.etablererEgenVirksomhet.tittel',
    beskrivelse: 'dokumentasjon.etablererEgenVirksomhet.beskrivelse',
    harSendtInn: false,
  },
  DokumentasjonUtgifterUtdanning: {
    id: AktivitetDokumentasjon.UTGIFTER_UTDANNING,
    spørsmålid: EUtdanning.semesteravgift,
    svarid: EAktivitet.tarUtdanning,
    label: '',
    tittel: 'utdanning.label.utgifter',
    beskrivelse: 'utdanning.label.utgifter.dokumentasjon',
    harSendtInn: false,
  },
  DokumentasjonUtdanning: {
    id: AktivitetDokumentasjon.UTDANNING,
    spørsmålid: EArbeidssituasjon.hvaErDinArbeidssituasjon,
    svarid: EAktivitet.tarUtdanning,
    label: '',
    tittel: 'dokumentasjon.utdanning.tittel',
    beskrivelse: 'dokumentasjon.utdanning.beskrivelse',
    harSendtInn: false,
  },
  DokumentasjonArbeidskontrakt: {
    id: SituasjonDokumentasjon.ARBEIDSKONTRAKT,
    spørsmålid: ESituasjon.gjelderDetteDeg,
    svarid: EAktivitet.harFåttJobbTilbud,
    label: '',
    tittel: 'dokumentasjon.arbeidskontrakt.tittel',
    beskrivelse: 'dokumentasjon.arbeidskontrakt.beskrivelse',
    harSendtInn: false,
  },

  //ArbeidsgiverConfig
  DokumentasjonLærling: {
    id: AktivitetDokumentasjon.LÆRLING,
    spørsmålid: EArbeidsgiver.ansettelsesforhold,
    svarid: EStilling.lærling,
    label: '',
    tittel: 'dokumentasjon.lærling.tittel',
    harSendtInn: false,
  },

  //BarneConfig
  Terminbekreftelse: {
    id: BarnDokumentasjon.TERMINBEKREFTELSE,
    spørsmålid: EBarn.født,
    svarid: ESvar.NEI,
    label: '',
    tittel: 'dokumentasjon.terminbekreftelse.tittel',
    harSendtInn: false,
  },

  //BarnepassConfig
  FakturaFraBarnepassordning: {
    id: BarnetilsynDokumentasjon.FAKTURA_BARNEPASSORDNING,
    spørsmålid: EBarnepass.hvaSlagsBarnepassOrdning,
    label: '',
    svarid: ETypeBarnepassOrdning.barnehageOgLiknende,
    tittel: 'dokumentasjon.barnehageOgLiknende.tittel',
    beskrivelse: 'dokumentasjon.barnehageOgLiknende.beskrivelse',
    harSendtInn: false,
  },

  AvtaleMedBarnepasser: {
    id: BarnetilsynDokumentasjon.AVTALE_BARNEPASSER,
    spørsmålid: EBarnepass.hvaSlagsBarnepassOrdning,
    label: '',
    svarid: ETypeBarnepassOrdning.privat,
    tittel: 'dokumentasjon.privatBarnepass.tittel',
    beskrivelse: 'dokumentasjon.privatBarnepass.beskrivelse',
    harSendtInn: false,
  },

  DokumentasjonTrengerMerPassEnnJevnaldrede: {
    id: BarnetilsynDokumentasjon.TRENGER_MER_PASS_ENN_JEVNALDREDE,
    spørsmålid: EBarnepass.årsakBarnepass,
    label: '',
    svarid: EÅrsakBarnepass.trengerMerPassEnnJevnaldrede,
    tittel: 'dokumentasjon.trengerMerPassEnnJevnaldrede.tittel',
    beskrivelse: 'dokumentasjon.trengerMerPassEnnJevnaldrede.beskrivelse',
    harSendtInn: false,
  },

  DokumentasjonUtenomVanligArbeidstid: {
    id: BarnetilsynDokumentasjon.ARBEIDSTID,
    spørsmålid: EBarnepass.årsakBarnepass,
    label: '',
    svarid: EÅrsakBarnepass.utenomVanligArbeidstid,
    tittel: 'dokumentasjon.barnepassRoterendeArbeidstid.tittel',
    harSendtInn: false,
  },

  DokumentasjonMyeBortePgaJobb: {
    id: BarnetilsynDokumentasjon.ROTERENDE_ARBEIDSTID,
    spørsmålid: EBarnepass.årsakBarnepass,
    label: '',
    svarid: EÅrsakBarnepass.myeBortePgaJobb,
    tittel: 'dokumentasjon.barnepassArbeidstid.tittel',
    harSendtInn: false,
  },

  //Bosituasjon
  DokumentasjonBorPåUlikeAdresser: {
    id: BosituasjonDokumentasjon.BOR_PÅ_ULIKE_ADRESSER,
    spørsmålid: EBosituasjon.delerBoligMedAndreVoksne,
    svarid: ESøkerDelerBolig.tidligereSamboerFortsattRegistrertPåAdresse,
    label: '',
    tittel: 'dokumentasjon.ulikeAdresser.tittel',
    beskrivelse: 'dokumentasjon.ulikeAdresser.beskrivelse',
    harSendtInn: false,
  },

  //Forelder
  DokumentasjonBarnBorHosDeg: {
    id: BarnasBostedDokumentasjon.BARN_BOR_HOS_SØKER,
    spørsmålid: EForelder.skalBarnetBoHosSøker,
    svarid: ESkalBarnetBoHosSøker.jaMenSamarbeiderIkke,
    label: '',
    tittel: 'dokumentasjon.barnBorHosSøker.tittel',
    beskrivelse: 'dokumentasjon.barnBorHosSøker.beskrivelse',
    harSendtInn: false,
  },
  SamværsavtaleMedKonkreteTidspunkter: {
    id: BarnasBostedDokumentasjon.SAMVÆRSAVTALE,
    spørsmålid: EForelder.harDereSkriftligSamværsavtale,
    svarid: EHarSkriftligSamværsavtale.jaKonkreteTidspunkter,
    label: '',
    tittel: 'dokumentasjon.samværsavtale.tittel',
    harSendtInn: false,
  },
  SamværsavtaleUtenKonkreteTidspunkter: {
    id: BarnasBostedDokumentasjon.SAMVÆRSAVTALE,
    spørsmålid: EForelder.harDereSkriftligSamværsavtale,
    svarid: EHarSkriftligSamværsavtale.jaIkkeKonkreteTidspunkter,
    label: '',
    tittel: 'dokumentasjon.samværsavtale.tittel',
    harSendtInn: false,
  },

  //Situasjon
  DokumentasjonSykdom: {
    id: SituasjonDokumentasjon.SYKDOM,
    spørsmålid: ESituasjon.gjelderDetteDeg,
    svarid: DinSituasjonType.erSyk,
    label: '',
    tittel: 'dokumentasjon.syk-dinSituasjon.tittel',
    beskrivelse: 'dokumentasjon.syk-dinSituasjon.beskrivelse',
    harSendtInn: false,
  },
  DokumentasjonSyktBarn: {
    id: SituasjonDokumentasjon.SYKT_BARN,
    spørsmålid: ESituasjon.gjelderDetteDeg,
    svarid: DinSituasjonType.harSyktBarn,
    label: '',
    tittel: 'dokumentasjon.syktBarn.tittel',
    beskrivelse: 'dokumentasjon.syktBarn.beskrivelse',
    harSendtInn: false,
  },
  DokumentasjonBarnepassMangel: {
    id: SituasjonDokumentasjon.BARNEPASS,
    spørsmålid: ESituasjon.gjelderDetteDeg,
    svarid: DinSituasjonType.harSøktBarnepassOgVenterEnnå,
    label: '',
    tittel: 'dokumentasjon.barnepass.tittel',
    beskrivelse: 'dokumentasjon.barnepass.beskrivelse',
    harSendtInn: false,
  },
  DokumentasjonBarnetilsynBehov: {
    id: SituasjonDokumentasjon.BARNETILSYN_BEHOV,
    spørsmålid: ESituasjon.gjelderDetteDeg,
    svarid: DinSituasjonType.harBarnMedSærligeBehov,
    label: '',
    tittel: 'dokumentasjon.barnetilsynsbehov.tittel',
    beskrivelse: 'dokumentasjon.barnetilsynsbehov.beskrivelse',
    harSendtInn: false,
  },
  ArbeidsforholdOgOppsigelsesårsak: {
    id: SituasjonDokumentasjon.ARBEIDSFORHOLD_OPPSIGELSE,
    spørsmålid: ESituasjon.sagtOppEllerRedusertStilling,
    svarid: ESagtOppEllerRedusertStilling.sagtOpp,
    label: '',
    tittel: 'dokumentasjon.arbeidsforhold-oppsigelse.tittel',
    harSendtInn: false,
  },
  ArbeidsforholdOgRedusertArbeidstid: {
    id: SituasjonDokumentasjon.ARBEIDSFORHOLD_REDUSERT_ARBEIDSTID,
    spørsmålid: ESituasjon.sagtOppEllerRedusertStilling,
    svarid: ESagtOppEllerRedusertStilling.redusertStilling,
    label: '',
    tittel: 'dokumentasjon.arbeidsforhold-redusert.tittel',
    harSendtInn: false,
  },

  //Sivilstatus
  ErklæringSamlivsbrudd: {
    id: OmDegDokumentasjon.SAMLIVSBRUDD,
    spørsmålid: ESivilstatusSøknadid.årsakEnslig,
    svarid: EBegrunnelse.samlivsbruddForeldre,
    label: '',
    tittel: 'dokumentasjon.begrunnelse.tittel',
    beskrivelse: 'dokumentasjon.begrunnelse.beskrivelse',
    harSendtInn: false,
  },
  DokumentasjonInngåttEkteskap: {
    id: OmDegDokumentasjon.INNGÅTT_EKTESKAP,
    spørsmålid: ESivilstatusSøknadid.erUformeltGift,
    svarid: ESvar.JA,
    label: '',
    tittel: 'dokumentasjon.inngåttEkteskap.tittel',
    harSendtInn: false,
  },
  DokumentasjonUformeltSeparertEllerSkilt: {
    id: OmDegDokumentasjon.UFORMELL_SEPARASJON_ELLER_SKILSMISSE,
    spørsmålid: ESivilstatusSøknadid.erUformeltSeparertEllerSkilt,
    svarid: ESvar.JA,
    label: '',
    tittel: 'dokumentasjon.separasjonEllerSkilsmisse.tittel',
    harSendtInn: false,
  },
  BekreftelseSeparasjonSøknad: {
    id: OmDegDokumentasjon.SEPARASJON_ELLER_SKILSMISSE,
    spørsmålid: ESivilstatusSøknadid.harSøktSeparasjon,
    svarid: ESvar.JA,
    label: '',
    tittel: 'dokumentasjon.søktSeparasjon.tittel',
    beskrivelse: 'dokumentasjon.søktSeparasjon.beskrivelse',
    harSendtInn: false,
  },
  MeldtAdresseendring: {
    id: AdresseopplysningerDokumentasjon.MELDT_ADRESSEENDRING,
    spørsmålid: EAdresseopplysninger.harMeldtAdresseendring,
    svarid: ESvar.JA,
    label: '',
    tittel: 'dokumentasjon.meldtAdresseendring.tittel',
    beskrivelse: 'dokumentasjon.meldtAdresseendring.beskrivelse',
    harSendtInn: false,
  },
};
