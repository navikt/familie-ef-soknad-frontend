import constate from 'constate';
import { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Søknad } from '../../../../../../models/søknad/søknad';
import { Stønadstype } from '../../../../../../models/søknad/stønadstyper';
import { DinTidligereSamboer } from '../sivilstatus/begrunnelse/OmDenTidligereSamboerenDin';
import { ILandMedKode } from '../../../../../../models/steg/omDeg/medlemskap';
import { UtenlandsoppholdPeriode } from '../medlemskap/typer';
import { SøknadSteg } from '../komponenter/stegindikator/GenerelleSøknadSteg';
import { IRoute } from '../../../../../../models/routes';
import { ISpørsmål, ISvar } from '../../../../../../models/felles/spørsmålogsvar';
import { MellomlagretSøknad } from '../../../../../../models/søknad/søknad';
import { useLokalIntlContext } from '../../../../../../context/LokalIntlContext';
import { erOmDegStegKomplettOgGyldig } from './OmDegV2Helpers';
import { mapOmDegV2TilLegacy } from '../OmDegV2Mapper';

export interface AdresseopplysningerData {
  søkerBorPåRegistrertAdresse?: boolean;
  søkerHarMeldtAdresseEndring?: boolean;
}

export interface SivilstatusData {
  søkerHarSøktSeperasjon?: boolean;
  separasjonsDato?: Date;
  søkerErGiftUtenRegistrering?: boolean;
  søkerErSeparertEllerSkiltUtenRegistrering?: boolean;
  årsakEnslig?: string;
  datoSamlivsbruddMedAnnenForelder?: Date;
  søkerSinTidligereSamboer?: DinTidligereSamboer;
  omsorgEndringDato?: Date;
}

export interface MedlemskapData {
  søkerOgBarnOppholderSegINorge?: boolean;
  oppholdsland?: ILandMedKode;
  søkerBosattINorgeSiste5År?: boolean;
  perioderBoddIUtlandet?: UtenlandsoppholdPeriode[];
}

export interface OmDegStegData {
  personopplysningerData?: AdresseopplysningerData;
  sivilstatusData?: SivilstatusData;
  medlemskapData?: MedlemskapData;
}

export interface Props<T extends Søknad> {
  stønadstype: Stønadstype;
  søknad: T;
  oppdaterSøknad: (søknad: T) => void;
  mellomlagretSøknad: MellomlagretSøknad | undefined;
  mellomlagreSøknad: (steg: string, oppdatertSøknad: T) => void;
  routes: IRoute[];
  pathOppsummering: string | undefined;
  settDokumentasjonsbehov: (spørsmål: ISpørsmål, valgtSvar: ISvar, erHuketAv?: boolean) => void;
}

export const [OmDegProviderV2, useOmDegV2] = constate(
  ({
    stønadstype,
    søknad,
    oppdaterSøknad,
    mellomlagreSøknad,
    routes,
    pathOppsummering,
    settDokumentasjonsbehov,
  }: Props<Søknad>) => {
    const intl = useLokalIntlContext();
    const location = useLocation();
    const søker = søknad.person.søker;
    const sivilstatus = useState(søknad.sivilstatus);

    const søknadSteg: SøknadSteg = { id: 'omDeg', stegKey: 'stegtittel.omDeg' };

    // V2 data structure
    const [personopplysningerData, settPersonopplysningerData] = useState<AdresseopplysningerData>(
      {}
    );

    const [sivilstatusData, settSivilstatusData] = useState<SivilstatusData>({});

    const [medlemskapData, settMedlemskapData] = useState<MedlemskapData>({});

    const oppdaterPersonopplysninger = useCallback((data: Partial<AdresseopplysningerData>) => {
      settPersonopplysningerData((prev) => ({
        ...prev,
        ...data,
      }));
    }, []);

    const oppdaterSivilstatus = useCallback((data: Partial<SivilstatusData>) => {
      settSivilstatusData((prev) => ({
        ...prev,
        ...data,
      }));
    }, []);

    const oppdaterMedlemskap = useCallback((data: Partial<MedlemskapData>) => {
      settMedlemskapData((prev) => ({
        ...prev,
        ...data,
      }));
    }, []);

    const hentStegData = useCallback(
      (): OmDegStegData => ({
        personopplysningerData,
        sivilstatusData,
        medlemskapData,
      }),
      [personopplysningerData, sivilstatusData, medlemskapData]
    );

    const erAlleSpørsmålBesvart = useCallback(() => {
      return erOmDegStegKomplettOgGyldig(
        personopplysningerData,
        sivilstatusData,
        medlemskapData,
        søker.sivilstand
      );
    }, [personopplysningerData, sivilstatusData, medlemskapData, søker.sivilstand]);

    const mellomlagreSteg = useCallback(() => {
      const lagacyData = mapOmDegV2TilLegacy(hentStegData(), intl);

      const oppdatertSøknad = {
        ...søknad,
        søkerBorPåRegistrertAdresse: lagacyData.søkerBorPåRegistrertAdresse,
        adresseopplysninger: lagacyData.adresseopplysninger,
        sivilstatus: lagacyData.sivilstatus,
        medlemskap: lagacyData.medlemskap,
      };

      oppdaterSøknad(oppdatertSøknad);

      return mellomlagreSøknad(location.pathname, oppdatertSøknad);
    }, [hentStegData, intl, søknad, oppdaterSøknad, mellomlagreSøknad, location.pathname]);

    return {
      // V2 specific data
      stønadstype,
      søker,
      sivilstatus,
      søknadSteg,
      personopplysningerData,
      sivilstatusData,
      medlemskapData,
      oppdaterPersonopplysninger,
      oppdaterSivilstatus,
      oppdaterMedlemskap,
      hentStegData,

      // Legacy struktur
      mellomlagreSteg,
      routes,
      pathOppsummering,
      settDokumentasjonsbehov,
      søknad,
      oppdaterSøknad,
      erAlleSpørsmålBesvart,
    };
  }
);
