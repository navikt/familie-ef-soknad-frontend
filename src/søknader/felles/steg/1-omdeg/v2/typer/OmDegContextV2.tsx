import constate from 'constate';
import { useState, useCallback } from 'react';
import { Søknad } from '../../../../../../models/søknad/søknad';
import { Stønadstype } from '../../../../../../models/søknad/stønadstyper';

export interface PersonopplysningerData {
  søkerBorPåRegistrertAdresse?: boolean;
  søkerHarMeldtAdresseEndring?: boolean;
}

export interface OmDegStegData {
  personopplysningerData?: PersonopplysningerData;
}

export interface Props<T extends Søknad> {
  stønadstype: Stønadstype;
  søknad: T;
}

export const [OmDegProviderV2, useOmDegV2] = constate(({ stønadstype, søknad }: Props<Søknad>) => {
  const søker = søknad.person.søker;

  const [personopplysningerData, setPersonopplysningerData] = useState<PersonopplysningerData>({});

  const oppdaterPersonopplysninger = useCallback((data: Partial<PersonopplysningerData>) => {
    setPersonopplysningerData((prev) => ({
      ...prev,
      ...data,
    }));
  }, []);

  const hentStegData = useCallback(
    (): OmDegStegData => ({
      personopplysningerData,
    }),
    [personopplysningerData]
  );

  return {
    stønadstype,
    søker,
    personopplysningerData,
    oppdaterPersonopplysninger,
    hentStegData,
  };
});
