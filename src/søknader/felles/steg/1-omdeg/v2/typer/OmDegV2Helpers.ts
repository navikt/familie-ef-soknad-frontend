import { AdresseopplysningerData, MedlemskapData, SivilstatusData } from './OmDegContextV2';
import { identErGyldig } from '../../../../../../utils/validering/validering';
import {
  erSøkerGift,
  erSøkerUGiftSkiltSeparertEllerEnke,
} from '../../../../../../utils/sivilstatus';

/**
 * Sjekker om sivilstatus skal vises basert på adresseopplysninger
 */
export const skalViseSivilstatus = (personopplysningerData: AdresseopplysningerData): boolean => {
  const { søkerBorPåRegistrertAdresse, søkerHarMeldtAdresseEndring } = personopplysningerData;

  if (søkerBorPåRegistrertAdresse === true) {
    return true;
  }

  return søkerBorPåRegistrertAdresse === false && søkerHarMeldtAdresseEndring === true;
};

/**
 * Sjekker om medlemskap skal vises basert på både personopplysninger og sivilstatus
 * Medlemskap kan kun vises hvis:
 * 1. Sivilstatus er synlig (basert på personopplysninger)
 * 2. Sivilstatus er ferdig utfylt
 */
export const skalViseMedlemskap = (
  personopplysningerData: AdresseopplysningerData,
  sivilstatusData: SivilstatusData
): boolean => {
  // Først sjekk om sivilstatus i det hele tatt skal vises
  if (!skalViseSivilstatus(personopplysningerData)) {
    return false;
  }

  // Deretter sjekk om sivilstatus er ferdig utfylt
  return erSivilstatusFerdigUtfylt(sivilstatusData);
};

/**
 * Sjekker om sivilstatus er ferdig utfylt basert på valgt årsak
 */
const erSivilstatusFerdigUtfylt = (sivilstatusData: SivilstatusData): boolean => {
  const { årsakEnslig } = sivilstatusData;

  // Om ingen årsak er valgt, så er ikke sivilstatus ferdig
  if (!årsakEnslig) {
    return false;
  }

  switch (årsakEnslig) {
    case 'samlivsbruddForeldre':
      return erSamlivsbruddForeldreFerdigUtfylt(sivilstatusData);

    case 'samlivsbruddAndre':
      return erSamlivsbruddAndreFerdigUtfylt(sivilstatusData);

    case 'endringISamværsordning':
      return erEndringISamværsordningFerdigUtfylt(sivilstatusData);

    case 'aleneFraFødsel':
    case 'dødsfall':
      return true;

    default:
      return false;
  }
};

/**
 * Sjekker om samlivsbrudd med foreldre er ferdig utfylt
 * Krever: datoSamlivsbruddMedAnnenForelder er satt
 */
const erSamlivsbruddForeldreFerdigUtfylt = (sivilstatusData: SivilstatusData): boolean => {
  return sivilstatusData.datoSamlivsbruddMedAnnenForelder !== undefined;
};

/**
 * Sjekker om samlivsbrudd med andre er ferdig utfylt
 * Krever: navn, gyldig identifikasjon (ident ELLER checkbox), fødselsdato og flyttedato
 */
const erSamlivsbruddAndreFerdigUtfylt = (sivilstatusData: SivilstatusData): boolean => {
  const samboer = sivilstatusData.søkerSinTidligereSamboer;

  if (!samboer) {
    return false;
  }

  // Sjekk om navn er utfylt
  const harNavn = samboer.navn.trim() !== '';
  if (!harNavn) {
    return false;
  }

  // Sjekk om fødselsdato er satt
  const harFødselsdato = samboer.fødseldato !== undefined;
  if (!harFødselsdato) {
    return false;
  }

  // Sjekk om flyttedato er satt
  const harFlyttedato = samboer.flytteDato !== undefined;
  if (!harFlyttedato) {
    return false;
  }

  // Sjekk ident - enten gyldig ident eller checkbox for brukerIkkeIdent
  if (samboer.brukerIkkeIdent) {
    return true;
  } else {
    return (
      samboer.personIdent !== undefined &&
      samboer.personIdent.trim() !== '' &&
      identErGyldig(samboer.personIdent)
    );
  }
};

/**
 * Sjekker om endring i samværsordning er ferdig utfylt
 * Krever: omsorgEndringDato er satt
 */
const erEndringISamværsordningFerdigUtfylt = (sivilstatusData: SivilstatusData): boolean => {
  return sivilstatusData.omsorgEndringDato !== undefined;
};

/**
 * Validerer om hele OmDeg-steget er komplett og gyldig
 */
export const erOmDegStegKomplettOgGyldig = (
  personopplysningerData: AdresseopplysningerData,
  sivilstatusData: SivilstatusData,
  medlemskapData: MedlemskapData,
  sivilstand: string
): boolean => {
  // 1. Valider personopplysninger
  if (!erPersonopplysningerGyldig(personopplysningerData)) {
    return false;
  }

  // 2. Hvis sivilstatus skal vises, valider den
  if (skalViseSivilstatus(personopplysningerData)) {
    if (!erSivilstatusGyldig(sivilstatusData, sivilstand)) {
      return false;
    }

    // 3. Hvis medlemskap skal vises, valider den
    if (skalViseMedlemskap(personopplysningerData, sivilstatusData)) {
      if (!erMedlemskapGyldig(medlemskapData)) {
        return false;
      }
    }
  }

  return true;
};

/**
 * Validerer personopplysninger-seksjonen
 * OPPDATERT: Sjekker ikke bare om spørsmålene er besvart, men også om svarene kvalifiserer for å fortsette
 */
const erPersonopplysningerGyldig = (data: AdresseopplysningerData): boolean => {
  const { søkerBorPåRegistrertAdresse, søkerHarMeldtAdresseEndring } = data;

  // Sjekk at første spørsmål er besvart
  if (søkerBorPåRegistrertAdresse === undefined) {
    return false;
  }

  // Hvis JA på første spørsmål, er det gyldig
  if (søkerBorPåRegistrertAdresse) {
    return true;
  }

  // Hvis NEI på første, må andre spørsmål være besvart
  if (!søkerBorPåRegistrertAdresse && søkerHarMeldtAdresseEndring === undefined) {
    return false;
  }

  // Hvis NEI på første og NEI på andre, er det ikke gyldig (kan ikke fortsette)
  if (!søkerBorPåRegistrertAdresse && søkerHarMeldtAdresseEndring === false) {
    return false;
  }

  // Hvis NEI på første og JA på andre, er det gyldig
  return !søkerBorPåRegistrertAdresse && søkerHarMeldtAdresseEndring === true;
};

/**
 * Validerer sivilstatus-seksjonen
 */
const erSivilstatusGyldig = (data: SivilstatusData, sivilstand: string): boolean => {
  // Sjekk basert på sivilstand
  if (erSøkerGift(sivilstand)) {
    return erGiftSeksjonGyldig(data);
  } else if (erSøkerUGiftSkiltSeparertEllerEnke(sivilstand)) {
    return erUgiftSkiltSeparertSeksjonGyldig(data);
  }

  return true;
};

/**
 * Validerer gift-seksjonen
 */
const erGiftSeksjonGyldig = (data: SivilstatusData): boolean => {
  const { søkerHarSøktSeperasjon, separasjonsDato } = data;

  // Må ha svart på om de har søkt separasjon
  if (søkerHarSøktSeperasjon === undefined) {
    return false;
  }

  // Hvis ja, må dato være satt
  if (søkerHarSøktSeperasjon === true && !separasjonsDato) {
    return false;
  }

  // Hvis nei, er de ikke kvalifiseret (men teknisk sett "gyldig" utfylt)
  return true;
};

/**
 * Validerer ugift/skilt/separert-seksjonen
 */
const erUgiftSkiltSeparertSeksjonGyldig = (data: SivilstatusData): boolean => {
  const { søkerErGiftUtenRegistrering, søkerErSeparertEllerSkiltUtenRegistrering, årsakEnslig } =
    data;

  // Må ha svart på begge spørsmål
  if (
    søkerErGiftUtenRegistrering === undefined ||
    søkerErSeparertEllerSkiltUtenRegistrering === undefined
  ) {
    return false;
  }

  // Må ha valgt årsak for å være alene med barn
  if (!årsakEnslig) {
    return false;
  }

  // Valider basert på valgt årsak
  return erÅrsakEnsligGyldig(data, årsakEnslig);
};

/**
 * Validerer årsak enslig-seksjonen
 */
const erÅrsakEnsligGyldig = (data: SivilstatusData, årsakEnslig: string): boolean => {
  switch (årsakEnslig) {
    case 'samlivsbruddForeldre':
      return data.datoSamlivsbruddMedAnnenForelder !== undefined;

    case 'samlivsbruddAndre':
      return erSamboerInformasjonGyldig(data);

    case 'endringISamværsordning':
      return data.omsorgEndringDato !== undefined;

    case 'aleneFraFødsel':
    case 'dødsfall':
      return true;

    default:
      return false;
  }
};

/**
 * Validerer samboer-informasjon
 */
const erSamboerInformasjonGyldig = (data: SivilstatusData): boolean => {
  const samboer = data.søkerSinTidligereSamboer;

  if (!samboer) {
    return false;
  }

  // Må ha navn
  if (!samboer.navn || samboer.navn.trim() === '') {
    return false;
  }

  // Må ha datoer
  if (!samboer.fødseldato || !samboer.flytteDato) {
    return false;
  }

  // Må ha enten gyldig ident eller ha krysset av for at de ikke har
  if (samboer.brukerIkkeIdent) {
    return true;
  } else {
    return (
      samboer.personIdent !== undefined &&
      samboer.personIdent.trim() !== '' &&
      identErGyldig(samboer.personIdent)
    );
  }
};

/**
 * Validerer medlemskap-seksjonen
 */
const erMedlemskapGyldig = (data: MedlemskapData): boolean => {
  const {
    søkerOgBarnOppholderSegINorge,
    oppholdsland,
    søkerBosattINorgeSiste5År,
    perioderBoddIUtlandet,
  } = data;

  // Må ha svart på første spørsmål
  if (søkerOgBarnOppholderSegINorge === undefined) {
    return false;
  }

  // Hvis nei, må ha valgt land
  if (søkerOgBarnOppholderSegINorge === false && !oppholdsland) {
    return false;
  }

  // Hvis de har svart på opphold eller valgt land, må de svare på 5-års spørsmålet
  if (søkerOgBarnOppholderSegINorge === true || oppholdsland) {
    if (søkerBosattINorgeSiste5År === undefined) {
      return false;
    }

    // Hvis nei på 5-års spørsmålet, må ha minst én periode
    if (søkerBosattINorgeSiste5År === false) {
      if (!perioderBoddIUtlandet || perioderBoddIUtlandet.length === 0) {
        return false;
      }

      // Alle perioder må være gyldige
      return perioderBoddIUtlandet.every((periode) => erUtenlandsperiodeGyldig(periode));
    }
  }

  return true;
};

/**
 * Validerer en enkelt utenlandsperiode
 */
const erUtenlandsperiodeGyldig = (periode: any): boolean => {
  // Må ha land
  if (!periode.land || periode.land.trim() === '') {
    return false;
  }

  // Må ha gyldige datoer
  if (!periode.fraDato || !periode.tilDato) {
    return false;
  }

  // Fra-dato må være før til-dato
  if (periode.fraDato >= periode.tilDato) {
    return false;
  }

  // Må ha begrunnelse
  if (!periode.begrunnelse || periode.begrunnelse.trim() === '') {
    return false;
  }

  // Hvis det er et EØS-land (dette må sjekkes basert på landslisten)
  // For nå antar vi at hvis idNummer eller sisteAdresse er relevant, så er det påkrevd
  if (periode.harIkkeIdNummer === false && (!periode.idNummer || periode.idNummer.trim() === '')) {
    return false;
  }

  return !(
    periode.harIkkeIdNummer === true &&
    (!periode.sisteAdresse || periode.sisteAdresse.trim() === '')
  );
};
