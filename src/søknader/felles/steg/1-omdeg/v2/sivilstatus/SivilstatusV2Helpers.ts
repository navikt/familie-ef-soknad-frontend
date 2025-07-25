import { SivilstatusData } from '../typer/OmDegContextV2';
import {
  erSøkerGift,
  erSøkerUGiftSkiltSeparertEllerEnke,
} from '../../../../../../utils/sivilstatus';

/**
 * Sjekker om spørsmål om uformelt gift er besvart i V2 strukturen
 */
const erSpørsmålOmUformeltGiftBesvartV2 = (sivilstatusData: SivilstatusData): boolean => {
  return sivilstatusData.søkerErGiftUtenRegistrering !== undefined;
};

/**
 * Sjekker om spørsmål om uformelt separert eller skilt er besvart i V2 strukturen
 */
const erSpørsmålOmUformeltSeparertEllerSkiltBesvartV2 = (
  sivilstatusData: SivilstatusData
): boolean => {
  return sivilstatusData.søkerErSeparertEllerSkiltUtenRegistrering !== undefined;
};

/**
 * Sjekker om spørsmål om søkt separasjon er utfylt i V2 strukturen
 */
const erSpørsmålOmSøktSeparasjonUtfyltV2 = (sivilstatusData: SivilstatusData): boolean => {
  const { søkerHarSøktSeperasjon, separasjonsDato } = sivilstatusData;

  if (søkerHarSøktSeperasjon === true) {
    return separasjonsDato !== undefined;
  }

  return søkerHarSøktSeperasjon === false;
};

/**
 * Hovedfunksjon som sjekker om alle sivilstand-spørsmål er besvart for V2 struktur
 * Brukes for å avgjøre om vi skal vise AleneMedBarnÅrsak
 */
export const erSivilstandSpørsmålBesvartV2 = (
  sivilstand: string,
  sivilstatusData: SivilstatusData
): boolean => {
  if (erSøkerUGiftSkiltSeparertEllerEnke(sivilstand)) {
    return (
      erSpørsmålOmUformeltGiftBesvartV2(sivilstatusData) &&
      erSpørsmålOmUformeltSeparertEllerSkiltBesvartV2(sivilstatusData)
    );
  } else if (erSøkerGift(sivilstand)) {
    return erSpørsmålOmSøktSeparasjonUtfyltV2(sivilstatusData);
  }

  return true;
};
