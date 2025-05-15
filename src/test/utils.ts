import {
  Adresse,
  IPerson,
  IPersonDetaljer,
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
import {
  IMedlemskap,
  IUtenlandsopphold,
} from '../models/steg/omDeg/medlemskap';
import { IBosituasjon } from '../models/steg/bosituasjon';
import { IAksjeselskap, IAktivitet } from '../models/steg/aktivitet/aktivitet';
import { IDinSituasjon } from '../models/steg/dinsituasjon/meromsituasjon';
import { IDokumentasjon } from '../models/steg/dokumentasjon';
import { ISøknad } from '../models/søknad/søknad';
import { IArbeidsgiver } from '../models/steg/aktivitet/arbeidsgiver';
import { IArbeidssøker } from '../models/steg/aktivitet/arbeidssøker';
import { IFirma } from '../models/steg/aktivitet/firma';
import { IUnderUtdanning } from '../models/steg/aktivitet/utdanning';
import { IBarn } from '../models/steg/barn';

export const lagSøknad = (
  innsendingsdato?: Date,
  person?: IPerson,
  søkerBorPåRegistrertAdresse?: ISpørsmålBooleanFelt,
  adresseopplysninger?: IAdresseopplysninger,
  sivilstatus?: ISivilstatus,
  medlemskap?: IMedlemskap,
  bosituasjon?: IBosituasjon,
  aktivitet?: IAktivitet,
  merOmDinSituasjon?: IDinSituasjon,
  dokumentasjonsbehov?: IDokumentasjon[],
  harBekreftet?: boolean,
  locale?: any,
  skalBehandlesINySaksbehandling?: boolean,
  datoPåbegyntSøknad?: string
): ISøknad => {
  return {
    innsendingsdato: innsendingsdato,
    person: person ?? lagPerson(),
    søkerBorPåRegistrertAdresse: søkerBorPåRegistrertAdresse,
    adresseopplysninger: adresseopplysninger ?? lagAdresseopplysninger(),
    sivilstatus: sivilstatus ?? lagSivilstatus(),
    medlemskap: medlemskap ?? lagMedlemskap(),
    bosituasjon: bosituasjon ?? lagBosituasjon(),
    aktivitet: aktivitet ?? lagAktivitet(),
    merOmDinSituasjon: merOmDinSituasjon ?? lagDinSituasjon(),
    dokumentasjonsbehov: dokumentasjonsbehov ?? [],
    harBekreftet: harBekreftet ?? false,
    locale: locale,
    skalBehandlesINySaksbehandling: skalBehandlesINySaksbehandling,
    datoPåbegyntSøknad: datoPåbegyntSøknad,
  };
};

export const lagDinSituasjon = (
  gjelderDetteDeg?: ISpørsmålListeFelt,
  søknadsdato?: IDatoFelt,
  sagtOppEllerRedusertStilling?: ISpørsmålFelt,
  begrunnelseSagtOppEllerRedusertStilling?: ITekstFelt,
  datoSagtOppEllerRedusertStilling?: IDatoFelt,
  søkerFraBestemtMåned?: ISpørsmålBooleanFelt
): IDinSituasjon => {
  return {
    gjelderDetteDeg: gjelderDetteDeg ?? lagSpørsmålListeFelt(),
    søknadsdato: søknadsdato,
    sagtOppEllerRedusertStilling: sagtOppEllerRedusertStilling,
    begrunnelseSagtOppEllerRedusertStilling:
      begrunnelseSagtOppEllerRedusertStilling,
    datoSagtOppEllerRedusertStilling: datoSagtOppEllerRedusertStilling,
    søkerFraBestemtMåned: søkerFraBestemtMåned,
  };
};

export const lagAktivitet = (
  erIArbeid?: ISpørsmålFelt,
  hvaErDinArbeidssituasjon?: ISpørsmålListeFelt,
  etablererEgenVirksomhet?: ISpørsmålFelt,
  arbeidsforhold?: IArbeidsgiver[],
  datoOppstartJobb?: IDatoFelt,
  arbeidssøker?: IArbeidssøker,
  egetAS?: IAksjeselskap[],
  firma?: IFirma,
  firmaer?: IFirma[],
  underUtdanning?: IUnderUtdanning
): IAktivitet => {
  return {
    erIArbeid: erIArbeid,
    hvaErDinArbeidssituasjon:
      hvaErDinArbeidssituasjon ?? lagSpørsmålListeFelt(),
    etablererEgenVirksomhet: etablererEgenVirksomhet ?? lagSpørsmålFelt(),
    arbeidsforhold: arbeidsforhold,
    datoOppstartJobb: datoOppstartJobb,
    arbeidssøker: arbeidssøker,
    egetAS: egetAS,
    firma: firma,
    firmaer: firmaer,
    underUtdanning: underUtdanning,
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

export const lagTekstListeFelt = (
  label?: string,
  verdi?: string[]
): ITekstListeFelt => {
  return {
    label: label ?? '',
    verdi: verdi ?? [],
  };
};

export const lagBosituasjon = (
  delerBoligMedAndreVoksne?: ISpørsmålFelt,
  skalGifteSegEllerBliSamboer?: ISpørsmålBooleanFelt,
  datoFlyttetSammenMedSamboer?: IDatoFelt,
  datoSkalGifteSegEllerBliSamboer?: IDatoFelt,
  datoFlyttetFraHverandre?: IDatoFelt,
  samboerDetaljer?: IPersonDetaljer,
  vordendeSamboerEktefelle?: IPersonDetaljer
): IBosituasjon => {
  return {
    delerBoligMedAndreVoksne: delerBoligMedAndreVoksne ?? lagSpørsmålFelt(),
    skalGifteSegEllerBliSamboer:
      skalGifteSegEllerBliSamboer ?? lagSpørsmålBooleanFelt(),
    datoFlyttetSammenMedSamboer: datoFlyttetSammenMedSamboer,
    datoSkalGifteSegEllerBliSamboer: datoSkalGifteSegEllerBliSamboer,
    datoFlyttetFraHverandre: datoFlyttetFraHverandre,
    samboerDetaljer: samboerDetaljer,
    vordendeSamboerEktefelle: vordendeSamboerEktefelle,
  };
};

export const lagSpørsmålBooleanFelt = (
  spørsmålid?: string,
  svarid?: string
): ISpørsmålBooleanFelt => {
  return {
    spørsmålid: spørsmålid ?? '',
    svarid: svarid ?? '',
    ...lagBooleanFelt(),
  };
};

export const lagSpørsmålFelt = (
  spørsmålid?: string,
  svarid?: string
): ISpørsmålFelt => {
  return {
    spørsmålid: spørsmålid ?? '',
    svarid: svarid ?? '',
    ...lagTekstfelt(),
  };
};

export const lagTekstfelt = (label?: string, verdi?: string): ITekstFelt => {
  return { label: label ?? '', verdi: verdi ?? '' };
};

export const lagBooleanFelt = (
  label?: string,
  verdi?: boolean
): IBooleanFelt => {
  return {
    label: label ?? '',
    verdi: verdi ?? false,
  };
};

export const lagMedlemskap = (
  søkerOppholderSegINorge?: IBooleanFelt,
  oppholdsland?: ISpørsmålFelt,
  søkerBosattINorgeSisteTreÅr?: IBooleanFelt,
  perioderBoddIUtlandet?: IUtenlandsopphold[]
): IMedlemskap => {
  return {
    søkerOppholderSegINorge: søkerOppholderSegINorge,
    oppholdsland: oppholdsland,
    søkerBosattINorgeSisteTreÅr: søkerBosattINorgeSisteTreÅr,
    perioderBoddIUtlandet: perioderBoddIUtlandet,
  };
};

export const lagSivilstatus = (
  harSøktSeparasjon?: IBooleanFelt,
  datoSøktSeparasjon?: IDatoFelt,
  erUformeltGift?: ISpørsmålBooleanFelt,
  erUformeltSeparertEllerSkilt?: ISpørsmålBooleanFelt,
  årsakEnslig?: ISpørsmålFelt,
  datoForSamlivsbrudd?: IDatoFelt,
  datoFlyttetFraHverandre?: IDatoFelt,
  datoEndretSamvær?: IDatoFelt,
  tidligereSamboerDetaljer?: IPersonDetaljer
): ISivilstatus => {
  return {
    harSøktSeparasjon: harSøktSeparasjon,
    datoSøktSeparasjon: datoSøktSeparasjon,
    erUformeltGift: erUformeltGift,
    erUformeltSeparertEllerSkilt: erUformeltSeparertEllerSkilt,
    årsakEnslig: årsakEnslig,
    datoForSamlivsbrudd: datoForSamlivsbrudd,
    datoFlyttetFraHverandre: datoFlyttetFraHverandre,
    datoEndretSamvær: datoEndretSamvær,
    tidligereSamboerDetaljer: tidligereSamboerDetaljer,
  };
};

export const lagPerson = (
  hash?: string,
  søker?: Søker,
  barn?: IBarn[]
): IPerson => {
  return { hash: hash ?? '', søker: søker ?? lagSøker(), barn: barn ?? [] };
};

export const lagSøker = (
  fnr?: string,
  alder?: number,
  forkortetNavn?: string,
  adresse?: Adresse,
  sivilstand?: string,
  statsborgerskap?: string,
  erStrengtFortrolig?: boolean
): Søker => {
  return {
    fnr: fnr ?? '',
    alder: alder ?? 0,
    forkortetNavn: forkortetNavn ?? '',
    adresse: adresse ?? lagAdresse(),
    sivilstand: sivilstand ?? '',
    statsborgerskap: statsborgerskap ?? '',
    erStrengtFortrolig: erStrengtFortrolig ?? false,
  };
};

export const lagAdresse = (
  adresse?: string,
  postnummer?: string,
  poststed?: string
): Adresse => {
  return {
    adresse: adresse ?? '',
    postnummer: postnummer ?? '',
    poststed: poststed ?? '',
  };
};

export const lagAdresseopplysninger = (
  harMeldtAdresseendring?: ISpørsmålBooleanFelt
): IAdresseopplysninger => {
  return {
    harMeldtAdresseendring: harMeldtAdresseendring ?? lagSpørsmålBooleanFelt(),
  };
};
