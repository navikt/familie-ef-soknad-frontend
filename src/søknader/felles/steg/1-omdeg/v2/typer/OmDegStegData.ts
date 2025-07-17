export interface OmDegStegData {
  personopplysningerData?: OmDegStegData;
}

export interface PersonopplysningerData {
  søkerBorPåRegistrertAdresse: boolean;
  søkerHarMeldtAdresseEndring?: boolean;
}

export interface SivilstatusData {
  søkerErGiftUtenRegistrering: boolean;
  søkerErSeparertEllerSkiltUtenRegistrering?: boolean;
}
