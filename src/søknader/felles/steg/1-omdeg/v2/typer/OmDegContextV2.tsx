import constate from 'constate';
import { useState, useCallback } from 'react';
import { Søknad } from '../../../../../../models/søknad/søknad';
import { Stønadstype } from '../../../../../../models/søknad/stønadstyper';

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
}

export interface OmDegStegData {
  personopplysningerData?: AdresseopplysningerData;
  sivilstatusData?: SivilstatusData;
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

  const hentStegData = useCallback(
    (): OmDegStegData => ({
      personopplysningerData,
      sivilstatusData,
    }),
    [personopplysningerData, sivilstatusData]
  );

  return {
    stønadstype,
    søker,
    sivilstatus,
    personopplysningerData,
    sivilstatusData,
    oppdaterPersonopplysninger,
    oppdaterSivilstatus,
    hentStegData,
  };
});
