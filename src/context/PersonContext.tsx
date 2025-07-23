import React, { createContext, useContext, useReducer, useState } from 'react';
import { Barn, IPerson, PersonData } from '../models/søknad/person';
import tomPerson from '../mock/initialState.json';
import { hentPersonData } from '../utils/søknad';
import { logAdressesperre } from '../utils/amplitude';
import { EAlvorlighetsgrad } from '../models/felles/feilmelding';
import { IBarn } from '../models/steg/barn';
import { ESkjemanavn } from '../utils/skjemanavn';
import { useLokalIntlContext } from './LokalIntlContext';
import { hentTekst } from '../utils/teksthåndtering';

export enum PersonActionTypes {
  HENT_PERSON = 'HENT_PERSON',
}

type IPersonAction = {
  type: PersonActionTypes;
  payload: IPerson;
};

type PersonContextType = {
  person: IPerson;
  settPerson: (action: IPersonAction) => void;
  error: boolean;
  settError: React.Dispatch<React.SetStateAction<boolean>>;
  feilmelding: string;
  alvorlighetsgrad: EAlvorlighetsgrad | undefined;
  fetchPersonData: (
    oppdaterSøknadMedBarn: (person: PersonData, barneliste: Barn[] | IBarn[]) => void,
    skjemanavn: ESkjemanavn
  ) => Promise<void>;
};

const reducer = (state: IPerson, action: IPersonAction) => {
  const person: IPerson = action.payload;

  switch (action.type) {
    case PersonActionTypes.HENT_PERSON: {
      return { ...person };
    }

    default:
      return state;
  }
};

const initialState: IPerson = tomPerson;

const PersonContext = createContext<PersonContextType>({
  person: initialState,
  settPerson: () => {},
  error: false,
  settError: () => {},
  feilmelding: '',
  alvorlighetsgrad: undefined,
  fetchPersonData: () => Promise.resolve(),
});

const usePersonContext = () => useContext(PersonContext);

const PersonProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  PersonProvider.displayName = 'PERSON_PROVIDER';
  const [person, settPerson] = useReducer(reducer, initialState);
  const [error, settError] = useState<boolean>(false);
  const [feilmelding, settFeilmelding] = useState<string>('');
  const [alvorlighetsgrad, settAlvorlighetsgrad] = useState<EAlvorlighetsgrad | undefined>(
    undefined
  );
  const intl = useLokalIntlContext();

  const håndterError = (e: any, skjemanavn: ESkjemanavn) => {
    const feil = e.response?.data?.feil;

    if (feil === 'adressesperre') {
      logAdressesperre(skjemanavn);
      settAlvorlighetsgrad(EAlvorlighetsgrad.INFO);
      settFeilmelding(hentTekst('barnasbosted.feilmelding.adressebeskyttelse', intl));
    } else {
      settFeilmelding(feil);
    }

    settError(true);
  };

  const fetchPersonData = (
    oppdaterSøknadMedBarn: (person: PersonData, barneliste: Barn[]) => void,
    skjemanavn: ESkjemanavn
  ) => {
    return hentPersonData()
      .then((response) => {
        settPerson({
          type: PersonActionTypes.HENT_PERSON,
          payload: response as unknown as IPerson,
        });

        oppdaterSøknadMedBarn(response, response.barn);
      })
      .catch((e) => håndterError(e, skjemanavn));
  };

  const value = {
    person,
    settPerson,
    error,
    settError,
    feilmelding,
    alvorlighetsgrad,
    fetchPersonData,
  };

  return <PersonContext.Provider value={value}>{children}</PersonContext.Provider>;
};

export { usePersonContext, PersonProvider };
