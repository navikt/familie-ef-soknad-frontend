import { Adresse, Barn, IPerson, PersonData, Søker } from '../models/søknad/person';
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
import { dagensIsoDatoMinusMåneder } from '../utils/dato';
import { IBarn } from '../models/steg/barn';
import { MellomlagretSøknadOvergangsstønad } from '../søknader/overgangsstønad/models/mellomlagretSøknad';
import { SistInnsendteSøknad } from '../components/forside/TidligereInnsendteSøknaderAlert';
import { Stønadstype } from '../models/søknad/stønadstyper';
import { IMedforelder } from '../models/steg/medforelder';

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
    skalGifteSegEllerBliSamboer: lagSpørsmålBooleanFelt(),
    datoFlyttetSammenMedSamboer: undefined,
    datoSkalGifteSegEllerBliSamboer: undefined,
    datoFlyttetFraHverandre: undefined,
    samboerDetaljer: undefined,
    vordendeSamboerEktefelle: undefined,
    ...bosituasjon,
  };
};

export const lagSpørsmålBooleanFelt = (
  spørsmålid?: string,
  svarid?: string,
  label?: string,
  verdi?: boolean
): ISpørsmålBooleanFelt => {
  return {
    spørsmålid: spørsmålid ?? '',
    svarid: svarid ?? '',
    ...lagBooleanFelt(label, verdi),
  };
};

export const lagSpørsmålFelt = (
  spørsmålid?: string,
  svarid?: string,
  label?: string,
  verdi?: string
): ISpørsmålFelt => {
  return {
    spørsmålid: spørsmålid ?? '',
    svarid: svarid ?? '',
    ...lagTekstfelt(label, verdi),
  };
};

export const lagTekstfelt = (label?: string, verdi?: string): ITekstFelt => {
  return { label: label ?? '', verdi: verdi ?? '' };
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
  const dagensDato = new Date();
  dagensDato.setMonth(dagensDato.getMonth() - 1);

  return {
    alder: 10,
    fnr: '12345678910',
    fødselsdato: dagensIsoDatoMinusMåneder(1),
    harAdressesperre: false,
    harSammeAdresse: false,
    medforelder: undefined,
    navn: 'Kjell Gunnar',
    ...barn,
  };
};

export const lagIBarn = (barn?: Partial<IBarn>): IBarn => {
  const dagensDato = new Date();
  dagensDato.setMonth(dagensDato.getMonth() - 1);

  return {
    id: '1234',
    fnr: undefined,
    alder: lagTekstfelt('', ''),
    fødselsdato: lagTekstfelt('Fødselsdato', '2021-05-09'),
    ident: lagTekstfelt('', ''),
    harSammeAdresse: lagBooleanFelt('', true),
    navn: lagTekstfelt('', ''),
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

export const lagSistInnsendteSøknad = (
  søknad?: Partial<SistInnsendteSøknad>
): SistInnsendteSøknad => {
  const dagensDato = new Date();
  dagensDato.setMonth(dagensDato.getMonth() - 1);

  return {
    søknadsdato: dagensIsoDatoMinusMåneder(1),
    stønadType: Stønadstype.overgangsstønad,
    ...søknad,
  };
};
