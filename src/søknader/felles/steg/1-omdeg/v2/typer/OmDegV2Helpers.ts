import { AdresseopplysningerData, SivilstatusData } from './OmDegContextV2';
import { identErGyldig } from '../../../../../../utils/validering/validering';

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
 * Sjekker om medlemskap skal vises basert på sivilstatus
 */
export const skalViseMedlemskap = (sivilstatusData: SivilstatusData): boolean => {
  const { årsakEnslig } = sivilstatusData;

  // Om ingen årsak er valgt, så skal ikke medlemskap vises
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

  // Sjekk identifikasjon - enten gyldig ident eller checkbox for brukerIkkeIdent
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
