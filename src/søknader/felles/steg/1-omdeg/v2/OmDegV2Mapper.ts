import {
  IAdresseopplysninger,
  EAdresseopplysninger,
} from '../../../../../models/steg/adresseopplysninger';
import {
  ISivilstatus,
  ESivilstatusSøknadid,
  EBegrunnelse,
} from '../../../../../models/steg/omDeg/sivilstatus';
import {
  IMedlemskap,
  EMedlemskap,
  IUtenlandsopphold,
} from '../../../../../models/steg/omDeg/medlemskap';
import {
  ISpørsmålBooleanFelt,
  ISpørsmålFelt,
  IDatoFelt,
} from '../../../../../models/søknad/søknadsfelter';
import { IPersonDetaljer } from '../../../../../models/søknad/person';
import { ESøknad } from '../../../../overgangsstønad/models/søknad';
import { ESvar } from '../../../../../models/felles/spørsmålogsvar';
import { LokalIntlShape } from '../../../../../language/typer';
import { hentTekst } from '../../../../../utils/teksthåndtering';
import {
  AdresseopplysningerData,
  MedlemskapData,
  OmDegStegData,
  SivilstatusData,
} from './typer/OmDegContextV2';

/**
 * Mapper hovedfunksjon som konverterer all V2 data til legacy format
 */
export const mapOmDegV2TilLegacy = (v2Data: OmDegStegData, intl: LokalIntlShape) => {
  return {
    søkerBorPåRegistrertAdresse: v2Data.personopplysningerData
      ? mapSøkerBorPåRegistrertAdresse(v2Data.personopplysningerData, intl)
      : undefined,
    adresseopplysninger: v2Data.personopplysningerData
      ? mapAdresseopplysninger(v2Data.personopplysningerData, intl)
      : undefined,
    sivilstatus: v2Data.sivilstatusData ? mapSivilstatus(v2Data.sivilstatusData, intl) : {},
    medlemskap: v2Data.medlemskapData ? mapMedlemskap(v2Data.medlemskapData, intl) : {},
  };
};

/**
 * Mapper søkerBorPåRegistrertAdresse
 */
const mapSøkerBorPåRegistrertAdresse = (
  data: AdresseopplysningerData,
  intl: LokalIntlShape
): ISpørsmålBooleanFelt | undefined => {
  if (data.søkerBorPåRegistrertAdresse === undefined) {
    return undefined;
  }

  return {
    spørsmålid: ESøknad.søkerBorPåRegistrertAdresse,
    svarid: data.søkerBorPåRegistrertAdresse ? ESvar.JA : ESvar.NEI,
    label: hentTekst('personopplysninger.spm.riktigAdresse', intl),
    verdi: data.søkerBorPåRegistrertAdresse,
  };
};

/**
 * Mapper adresseopplysninger
 */
const mapAdresseopplysninger = (
  data: AdresseopplysningerData,
  intl: LokalIntlShape
): IAdresseopplysninger | undefined => {
  if (data.søkerBorPåRegistrertAdresse === true || data.søkerHarMeldtAdresseEndring === undefined) {
    return undefined;
  }

  return {
    harMeldtAdresseendring: {
      spørsmålid: EAdresseopplysninger.harMeldtAdresseendring,
      svarid: data.søkerHarMeldtAdresseEndring ? ESvar.JA : ESvar.NEI,
      label: hentTekst('personopplysninger.spm.meldtAdresseendring', intl),
      verdi: data.søkerHarMeldtAdresseEndring!,
    },
  };
};

/**
 * Mapper sivilstatus
 */
const mapSivilstatus = (data: SivilstatusData, intl: LokalIntlShape): ISivilstatus => {
  const sivilstatus: ISivilstatus = {};

  // Søkt separasjon - IBooleanFelt (uten spørsmålid/svarid)
  if (data.søkerHarSøktSeperasjon !== undefined) {
    sivilstatus.harSøktSeparasjon = {
      label: hentTekst('sivilstatus.spm.søktSeparasjon', intl),
      verdi: data.søkerHarSøktSeperasjon,
    };

    if (data.separasjonsDato) {
      sivilstatus.datoSøktSeparasjon = mapDato(
        data.separasjonsDato,
        'sivilstatus.datovelger.søktSeparasjon',
        intl
      );
    }
  }

  // Uformelt gift - ISpørsmålBooleanFelt
  if (data.søkerErGiftUtenRegistrering !== undefined) {
    sivilstatus.erUformeltGift = {
      spørsmålid: ESivilstatusSøknadid.erUformeltGift,
      svarid: data.søkerErGiftUtenRegistrering ? ESvar.JA : ESvar.NEI,
      label: hentTekst('sivilstatus.spm.erUformeltGift', intl),
      verdi: data.søkerErGiftUtenRegistrering,
    };
  }

  // Uformelt separert eller skilt - ISpørsmålBooleanFelt
  if (data.søkerErSeparertEllerSkiltUtenRegistrering !== undefined) {
    sivilstatus.erUformeltSeparertEllerSkilt = {
      spørsmålid: ESivilstatusSøknadid.erUformeltSeparertEllerSkilt,
      svarid: data.søkerErSeparertEllerSkiltUtenRegistrering ? ESvar.JA : ESvar.NEI,
      label: hentTekst('sivilstatus.spm.erUformeltSeparertEllerSkilt', intl),
      verdi: data.søkerErSeparertEllerSkiltUtenRegistrering,
    };
  }

  // Årsak enslig
  if (data.årsakEnslig) {
    sivilstatus.årsakEnslig = mapÅrsakEnslig(data.årsakEnslig, intl);

    // Map tilhørende data basert på årsak
    switch (data.årsakEnslig) {
      case 'samlivsbruddForeldre':
        if (data.datoSamlivsbruddMedAnnenForelder) {
          sivilstatus.datoForSamlivsbrudd = mapDato(
            data.datoSamlivsbruddMedAnnenForelder,
            'sivilstatus.datovelger.samlivsbrudd',
            intl
          );
        }
        break;

      case 'samlivsbruddAndre':
        if (data.søkerSinTidligereSamboer) {
          sivilstatus.tidligereSamboerDetaljer = mapTidligereSamboer(
            data.søkerSinTidligereSamboer,
            intl
          );

          if (data.søkerSinTidligereSamboer.flytteDato) {
            sivilstatus.datoFlyttetFraHverandre = mapDato(
              data.søkerSinTidligereSamboer.flytteDato,
              'sivilstatus.datovelger.flyttetFraHverandre',
              intl
            );
          }
        }
        break;

      case 'endringISamværsordning':
        if (data.omsorgEndringDato) {
          sivilstatus.datoEndretSamvær = mapDato(
            data.omsorgEndringDato,
            'sivilstatus.datovelger.endring',
            intl
          );
        }
        break;
    }
  }

  return sivilstatus;
};

/**
 * Mapper tidligere samboer til IPersonDetaljer
 */
const mapTidligereSamboer = (samboer: any, intl: LokalIntlShape): IPersonDetaljer => {
  return {
    navn: samboer.navn
      ? {
          label: hentTekst('person.navn', intl),
          verdi: samboer.navn,
        }
      : undefined,
    ident:
      samboer.personIdent && !samboer.brukerIkkeIdent
        ? {
            label: hentTekst('person.ident', intl),
            verdi: samboer.personIdent,
          }
        : undefined,
    fødselsdato: samboer.fødseldato
      ? mapDato(samboer.fødseldato, 'datovelger.fødselsdato', intl)
      : undefined,
    kjennerIkkeIdent: samboer.brukerIkkeIdent || false,
  };
};

/**
 * Mapper årsak enslig
 */
const mapÅrsakEnslig = (årsakEnslig: string, intl: LokalIntlShape): ISpørsmålFelt => {
  const årsakMap: Record<string, { svarid: EBegrunnelse; svarKey: string }> = {
    samlivsbruddForeldre: {
      svarid: EBegrunnelse.samlivsbruddForeldre,
      svarKey: 'sivilstatus.svar.samlivsbruddForeldre',
    },
    samlivsbruddAndre: {
      svarid: EBegrunnelse.samlivsbruddAndre,
      svarKey: 'sivilstatus.svar.samlivsbruddAndre',
    },
    endringISamværsordning: {
      svarid: EBegrunnelse.endringISamværsordning,
      svarKey: 'sivilstatus.svar.endringISamværsordning',
    },
    aleneFraFødsel: {
      svarid: EBegrunnelse.aleneFraFødsel,
      svarKey: 'sivilstatus.svar.aleneFraFødsel',
    },
    dødsfall: {
      svarid: EBegrunnelse.dødsfall,
      svarKey: 'sivilstatus.svar.dødsfall',
    },
  };

  const mapping = årsakMap[årsakEnslig];

  return {
    spørsmålid: ESivilstatusSøknadid.årsakEnslig,
    svarid: mapping.svarid,
    label: hentTekst('sivilstatus.spm.begrunnelse', intl),
    verdi: hentTekst(mapping.svarKey, intl),
  };
};

/**
 * Mapper medlemskap
 */
const mapMedlemskap = (data: MedlemskapData, intl: LokalIntlShape): IMedlemskap => {
  const medlemskap: IMedlemskap = {};

  // Oppholder seg i Norge - IBooleanFelt
  if (data.søkerOgBarnOppholderSegINorge !== undefined) {
    medlemskap.søkerOppholderSegINorge = {
      label: hentTekst('medlemskap.spm.opphold', intl),
      verdi: data.søkerOgBarnOppholderSegINorge,
    };
  }

  // Oppholdsland - ISpørsmålFelt
  if (data.oppholdsland) {
    medlemskap.oppholdsland = {
      spørsmålid: EMedlemskap.oppholdsland,
      svarid: data.oppholdsland.id,
      label: hentTekst('medlemskap.spm.oppholdsland', intl),
      verdi: data.oppholdsland.svar_tekst,
    };
  }

  // Bosatt i Norge siste 5 år - IBooleanFelt
  if (data.søkerBosattINorgeSiste5År !== undefined) {
    medlemskap.søkerBosattINorgeSisteTreÅr = {
      label: hentTekst('medlemskap.spm.bosatt', intl),
      verdi: data.søkerBosattINorgeSiste5År,
    };
  }

  // Perioder bodd i utlandet
  if (data.perioderBoddIUtlandet && data.perioderBoddIUtlandet.length > 0) {
    medlemskap.perioderBoddIUtlandet = data.perioderBoddIUtlandet.map((periode) =>
      mapUtenlandsperiode(periode, intl)
    );
  }

  return medlemskap;
};

/**
 * Mapper utenlandsperiode
 */
const mapUtenlandsperiode = (periode: any, intl: LokalIntlShape): IUtenlandsopphold => {
  // Finn landet i landslisten for å sjekke om det er EØS
  // Dette må kanskje passes inn eller hentes fra en annen kilde
  const erEøsLand = false; // TODO: Dette må sjekkes mot landslisten

  return {
    id: periode.id,
    periode: {
      label: hentTekst('medlemskap.periodeBoddIUtlandet.utenlandsopphold', intl),
      fra: mapDato(periode.fraDato, 'periode.fra', intl),
      til: mapDato(periode.tilDato, 'periode.til', intl),
    },
    land: {
      spørsmålid: EMedlemskap.utenlandsoppholdLand,
      svarid: periode.land, // Assuming land is stored as ID
      label: hentTekst('medlemskap.periodeBoddIUtlandet.land', intl),
      verdi: periode.land,
    },
    erEøsLand: erEøsLand,
    begrunnelse: {
      label: hentTekst('medlemskap.periodeBoddIUtlandet.begrunnelse', intl),
      verdi: periode.begrunnelse,
    },
    personidentEøsLand:
      periode.idNummer && !periode.harIkkeIdNummer
        ? {
            label: hentTekst('medlemskap.periodeBoddIUtlandet.utenlandskIDNummer', intl),
            verdi: periode.idNummer,
          }
        : undefined,
    kanIkkeOppgiPersonident: periode.harIkkeIdNummer,
    adresseEøsLand: periode.sisteAdresse
      ? {
          label: hentTekst('medlemskap.periodeBoddIUtlandet.sisteAdresse', intl),
          verdi: periode.sisteAdresse,
        }
      : undefined,
  };
};

/**
 * Hjelpefunksjon for å mappe datoer
 */
const mapDato = (dato: Date | undefined, labelKey: string, intl: LokalIntlShape): IDatoFelt => {
  return {
    label: hentTekst(labelKey, intl),
    verdi: dato ? formatDate(dato) : '',
  };
};

/**
 * Formater dato til string format
 */
const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};
