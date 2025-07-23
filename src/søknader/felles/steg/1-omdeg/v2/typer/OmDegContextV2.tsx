import constate from 'constate';
import { useState, useCallback } from 'react';
import { Søknad } from '../../../../../../models/søknad/søknad';
import { Stønadstype } from '../../../../../../models/søknad/stønadstyper';
import { DinTidligereSamboer } from '../sivilstatus/begrunnelse/OmDenTidligereSamboerenDin';
import { ILandMedKode } from '../../../../../../models/steg/omDeg/medlemskap';
import { UtenlandsoppholdPeriode } from '../medlemskap/typer';

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
}

export interface MedlemskapData {
  søkerOgBarnOppholderSegINorge?: boolean;
  oppholdsland?: ILandMedKode;
  søkerBosattINorgeSisteTreÅr?: boolean;
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
}

export const [OmDegProviderV2, useOmDegV2] = constate(({ stønadstype, søknad }: Props<Søknad>) => {
  const søker = søknad.person.søker;
  const sivilstatus = useState(søknad.sivilstatus);

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

  return {
    stønadstype,
    søker,
    sivilstatus,
    personopplysningerData,
    sivilstatusData,
    medlemskapData,
    oppdaterPersonopplysninger,
    oppdaterSivilstatus,
    oppdaterMedlemskap,
    hentStegData,
  };
});
