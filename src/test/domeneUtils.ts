import {
  Adresse,
  Barn,
  IPerson,
  IPersonDetaljer,
  PersonData,
  Søker,
} from '../models/søknad/person';
import {
  IBooleanFelt,
  IDatoFelt,
  ISpørsmålBooleanFelt,
  ISpørsmålFelt,
  ISpørsmålListeFelt,
  ITekstFelt,
  ITekstListeFelt,
} from '../models/søknad/søknadsfelter';
import { IAdresseopplysninger } from '../models/steg/adresseopplysninger';
import { ISivilstatus } from '../models/steg/omDeg/sivilstatus';
import { IMedlemskap } from '../models/steg/omDeg/medlemskap';
import { IBosituasjon } from '../models/steg/bosituasjon';
import { IAktivitet } from '../models/steg/aktivitet/aktivitet';
import { IDinSituasjon } from '../models/steg/dinsituasjon/meromsituasjon';
import { SøknadOvergangsstønad } from '../søknader/overgangsstønad/models/søknad';
import { IBarn } from '../models/steg/barn';
import { MellomlagretSøknadOvergangsstønad } from '../søknader/overgangsstønad/models/mellomlagretSøknad';
import { SistInnsendteSøknad } from '../components/forside/TidligereInnsendteSøknaderAlert';
import { Stønadstype } from '../models/søknad/stønadstyper';
import { IMedforelder } from '../models/steg/medforelder';
import { datoEnMånedTilbake, isoDatoEnMånedTilbake } from './dato';
import { IForelder } from '../models/steg/forelder';
import { MellomlagretSøknadBarnetilsyn } from '../søknader/barnetilsyn/models/mellomlagretSøknad';
import { SøknadBarnetilsyn } from '../søknader/barnetilsyn/models/søknad';
import { MellomlagretSøknadSkolepenger } from '../søknader/skolepenger/models/mellomlagretSøknad';
import { SøknadSkolepenger } from '../søknader/skolepenger/models/søknad';
import { DetaljertUtdanning } from '../søknader/skolepenger/models/detaljertUtdanning';
import { UnderUtdanning, Utdanning } from '../models/steg/aktivitet/utdanning';
import { IPeriode } from '../models/felles/periode';

export const lagSøknadOvergangsstønad = (
  søknad?: Partial<SøknadOvergangsstønad>
): SøknadOvergangsstønad => {
  return {
    innsendingsdato: undefined,
    person: lagPerson(),
    søkerBorPåRegistrertAdresse: undefined,
    adresseopplysninger: undefined,
    sivilstatus: lagSivilstatus(),
    medlemskap: lagMedlemskap(),
    bosituasjon: lagBosituasjon(),
    aktivitet: lagAktivitet(),
    merOmDinSituasjon: lagDinSituasjon(),
    dokumentasjonsbehov: [],
    harBekreftet: false,
    locale: '',
    skalBehandlesINySaksbehandling: true,
    datoPåbegyntSøknad: undefined,
    ...søknad,
  };
};

export const lagSøknadBarnetilsyn = (søknad?: Partial<SøknadBarnetilsyn>): SøknadBarnetilsyn => {
  return {
    innsendingsdato: undefined,
    person: lagPerson(),
    søkerBorPåRegistrertAdresse: undefined,
    sivilstatus: lagSivilstatus(),
    medlemskap: lagMedlemskap(),
    bosituasjon: lagBosituasjon(),
    aktivitet: lagAktivitet(),
    søkerFraBestemtMåned: undefined,
    adresseopplysninger: undefined,
    søknadsdato: undefined,
    dokumentasjonsbehov: [],
    harBekreftet: false,
    datoPåbegyntSøknad: undefined,
    locale: '',
    ...søknad,
  };
};

export const lagSøknadSkolepenger = (søknad?: Partial<SøknadSkolepenger>): SøknadSkolepenger => {
  return {
    innsendingsdato: undefined,
    person: lagPerson(),
    søkerBorPåRegistrertAdresse: undefined,
    adresseopplysninger: undefined,
    sivilstatus: lagSivilstatus(),
    medlemskap: lagMedlemskap(),
    bosituasjon: lagBosituasjon(),
    utdanning: lagDetaljertUtdanning(),
    dokumentasjonsbehov: [],
    harBekreftet: false,
    locale: '',
    ...søknad,
  };
};

export const lagDinSituasjon = (dinSituasjon?: Partial<IDinSituasjon>): IDinSituasjon => {
  return {
    gjelderDetteDeg: lagSpørsmålListeFelt(),
    søknadsdato: undefined,
    sagtOppEllerRedusertStilling: undefined,
    begrunnelseSagtOppEllerRedusertStilling: undefined,
    datoSagtOppEllerRedusertStilling: undefined,
    søkerFraBestemtMåned: undefined,
    ...dinSituasjon,
  };
};

export const lagAktivitet = (aktivitet?: Partial<IAktivitet>): IAktivitet => {
  return {
    erIArbeid: undefined,
    hvaErDinArbeidssituasjon: lagSpørsmålListeFelt(),
    etablererEgenVirksomhet: lagSpørsmålFelt(),
    arbeidsforhold: undefined,
    datoOppstartJobb: undefined,
    arbeidssøker: undefined,
    egetAS: undefined,
    firma: undefined,
    firmaer: undefined,
    underUtdanning: undefined,
    ...aktivitet,
  };
};

export const lagSpørsmålListeFelt = (
  spørsmålid?: string,
  svarid?: string[],
  alternativer?: string[]
): ISpørsmålListeFelt => {
  return {
    spørsmålid: spørsmålid ?? '',
    svarid: svarid ?? [],
    alternativer: alternativer ?? [],
    ...lagTekstListeFelt(),
  };
};

export const lagTekstListeFelt = (label?: string, verdi?: string[]): ITekstListeFelt => {
  return {
    label: label ?? '',
    verdi: verdi ?? [],
  };
};

export const lagBosituasjon = (bosituasjon?: Partial<IBosituasjon>): IBosituasjon => {
  return {
    delerBoligMedAndreVoksne: lagSpørsmålFelt(),
    skalGifteSegEllerBliSamboer: lagSpørsmålBooleanFelt({ verdi: false }),
    datoFlyttetSammenMedSamboer: undefined,
    datoSkalGifteSegEllerBliSamboer: undefined,
    datoFlyttetFraHverandre: undefined,
    samboerDetaljer: undefined,
    vordendeSamboerEktefelle: undefined,
    ...bosituasjon,
  };
};

export const lagSpørsmålBooleanFelt = (
  spørsmålBooleanFelt: Partial<ISpørsmålBooleanFelt>
): ISpørsmålBooleanFelt => {
  return {
    spørsmålid: '',
    svarid: '',
    label: '',
    verdi: false,
    ...spørsmålBooleanFelt,
  };
};

export const lagSpørsmålFelt = (spørsmålFelt?: Partial<ISpørsmålFelt>): ISpørsmålFelt => {
  return {
    spørsmålid: '',
    svarid: '',
    label: '',
    verdi: '',
    ...spørsmålFelt,
  };
};

export const lagTekstfelt = (tekstFelt?: Partial<ITekstFelt>): ITekstFelt => {
  return { label: '', verdi: '', ...tekstFelt };
};

export const lagBooleanFelt = (label?: string, verdi?: boolean): IBooleanFelt => {
  return {
    label: label ?? '',
    verdi: verdi ?? false,
  };
};

export const lagDatoFelt = (label: string, verdi: string): IDatoFelt => {
  return {
    label: label,
    verdi: verdi,
  };
};

export const lagPersonDetaljer = (personDetaljer?: Partial<IPersonDetaljer>): IPersonDetaljer => {
  return {
    navn: lagTekstfelt({ label: 'Navn' }),
    ident: lagTekstfelt({ label: 'Fødselsnummer / d-nummer (11 siffer)' }),
    fødselsdato: lagDatoFelt('Fødselsdato', datoEnMånedTilbake),
    kjennerIkkeIdent: false,
    ...personDetaljer,
  };
};

export const lagMedlemskap = (medlemskap?: Partial<IMedlemskap>): IMedlemskap => {
  return {
    søkerOppholderSegINorge: undefined,
    oppholdsland: undefined,
    søkerBosattINorgeSisteTreÅr: undefined,
    perioderBoddIUtlandet: undefined,
    ...medlemskap,
  };
};

export const lagSivilstatus = (sivilstatus?: Partial<ISivilstatus>): ISivilstatus => {
  return {
    harSøktSeparasjon: undefined,
    datoSøktSeparasjon: undefined,
    erUformeltGift: undefined,
    erUformeltSeparertEllerSkilt: undefined,
    årsakEnslig: undefined,
    datoForSamlivsbrudd: undefined,
    datoFlyttetFraHverandre: undefined,
    datoEndretSamvær: undefined,
    tidligereSamboerDetaljer: undefined,
    ...sivilstatus,
  };
};

export const lagPerson = (person?: Partial<IPerson>): IPerson => {
  return {
    hash: 'hash',
    søker: lagSøker(),
    barn: [lagIBarn()],
    ...person,
  };
};

export const lagSøker = (søker?: Partial<Søker>): Søker => {
  return {
    fnr: '01012512345',
    alder: 25,
    forkortetNavn: '',
    adresse: lagAdresse(),
    sivilstand: 'UGIFT',
    statsborgerskap: 'NORGE',
    erStrengtFortrolig: false,
    ...søker,
  };
};

export const lagAdresse = (adresse?: Partial<Adresse>): Adresse => {
  return {
    adresse: 'Testveien 10',
    postnummer: '2407',
    poststed: 'Andeby',
    ...adresse,
  };
};

export const lagAdresseopplysninger = (
  opplysninger?: Partial<IAdresseopplysninger>
): IAdresseopplysninger => {
  return {
    harMeldtAdresseendring: undefined,
    ...opplysninger,
  };
};

export const lagBarn = (barn?: Partial<Barn>): Barn => {
  return {
    alder: 10,
    fnr: '12345678910',
    fødselsdato: isoDatoEnMånedTilbake,
    harAdressesperre: false,
    harSammeAdresse: false,
    medforelder: undefined,
    navn: 'Kjell Gunnar',
    ...barn,
  };
};

export const lagIBarn = (barn?: Partial<IBarn>): IBarn => {
  return {
    id: '1234',
    fnr: undefined,
    alder: lagTekstfelt(),
    fødselsdato: lagTekstfelt({ label: 'Fødselsdato', verdi: isoDatoEnMånedTilbake }),
    ident: lagTekstfelt(),
    harSammeAdresse: lagBooleanFelt('', true),
    navn: lagTekstfelt(),
    født: undefined,
    lagtTil: undefined,
    forelder: undefined,
    særligeTilsynsbehov: undefined,
    skalHaBarnepass: undefined,
    barnepass: undefined,
    harAdressesperre: undefined,
    medforelder: undefined,
    annenForelderId: undefined,
    erFraForrigeSøknad: undefined,
    ...barn,
  };
};

export const lagPersonData = (personData?: Partial<PersonData>): PersonData => {
  return {
    søker: lagSøker(),
    barn: [lagBarn()],
    hash: 'hash',
    ...personData,
  };
};

export const lagIForelder = (forelder?: Partial<IForelder>): IForelder => {
  return {
    id: undefined,
    navn: undefined,
    skalBarnetBoHosSøker: undefined,
    fødselsdato: undefined,
    ident: undefined,
    kanIkkeOppgiAnnenForelderFar: undefined,
    hvorforIkkeOppgi: undefined,
    ikkeOppgittAnnenForelderBegrunnelse: undefined,
    borINorge: undefined,
    land: undefined,
    harAnnenForelderSamværMedBarn: undefined,
    harDereSkriftligSamværsavtale: undefined,
    hvordanPraktiseresSamværet: undefined,
    borAnnenForelderISammeHus: undefined,
    borAnnenForelderISammeHusBeskrivelse: undefined,
    boddSammenFør: undefined,
    flyttetFra: undefined,
    hvorMyeSammen: undefined,
    beskrivSamværUtenBarn: undefined,
    fraFolkeregister: undefined,
    ...forelder,
  };
};

export const lagIMedforelder = (medforelder?: Partial<IMedforelder>): IMedforelder => {
  return {
    alder: undefined,
    død: undefined,
    harAdressesperre: false,
    ident: undefined,
    navn: undefined,
    ...medforelder,
  };
};

export const lagMellomlagretSøknadOvergangsstønad = (
  søknad?: Partial<MellomlagretSøknadOvergangsstønad>
): MellomlagretSøknadOvergangsstønad => {
  return {
    søknad: lagSøknadOvergangsstønad(),
    modellVersjon: 7,
    gjeldendeSteg: '/',
    locale: '',
    ...søknad,
  };
};

export const lagMellomlagretSøknadBarnetilsyn = (
  søknad?: Partial<MellomlagretSøknadBarnetilsyn>
): MellomlagretSøknadBarnetilsyn => {
  return {
    søknad: lagSøknadBarnetilsyn(),
    modellVersjon: 2,
    gjeldendeSteg: '/',
    locale: '',
    ...søknad,
  };
};

export const lagMellomlagretSøknadSkolepenger = (
  søknad?: Partial<MellomlagretSøknadSkolepenger>
): MellomlagretSøknadSkolepenger => {
  return {
    søknad: lagSøknadSkolepenger(),
    modellVersjon: 2,
    gjeldendeSteg: '/',
    locale: '',
    ...søknad,
  };
};

export const lagSistInnsendteSøknad = (
  søknad?: Partial<SistInnsendteSøknad>
): SistInnsendteSøknad => {
  return {
    søknadsdato: isoDatoEnMånedTilbake,
    stønadType: Stønadstype.overgangsstønad,
    ...søknad,
  };
};

export const lagDetaljertUtdanning = (
  detaljertUtdanning?: Partial<DetaljertUtdanning>
): DetaljertUtdanning => {
  return {
    semesteravgift: undefined,
    studieavgift: undefined,
    eksamensgebyr: undefined,
    ...lagUnderUtdanning(),
    ...detaljertUtdanning,
  };
};

export const lagUnderUtdanning = (underUtdanning?: Partial<UnderUtdanning>) => {
  return {
    skoleUtdanningssted: lagTekstfelt(),
    offentligEllerPrivat: undefined,
    heltidEllerDeltid: undefined,
    arbeidsmengde: undefined,
    målMedUtdanning: undefined,
    harTattUtdanningEtterGrunnskolen: undefined,
    tidligereUtdanning: undefined,
    ...lagUtdanning(),
    ...underUtdanning,
  };
};

export const lagUtdanning = (utdanning?: Partial<Utdanning>): Utdanning => {
  return {
    id: '1',
    linjeKursGrad: undefined,
    periode: undefined,
    ...utdanning,
  };
};

export const lagPeriode = (fra: string, til: string): IPeriode => ({
  label: 'Mock periode',
  fra: { label: 'Fra', verdi: fra },
  til: { label: 'Til', verdi: til },
});
