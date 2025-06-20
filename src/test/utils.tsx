import {
  Adresse,
  Barn,
  IPerson,
  PersonData,
  Søker,
} from '../models/søknad/person';
import {
  IBooleanFelt,
  ISpørsmålBooleanFelt,
  ISpørsmålFelt,
  ISpørsmålListeFelt,
  ITekstFelt,
  ITekstListeFelt,
} from '../models/søknad/søknadsfelter';
import { IAdresseopplysninger } from '../models/steg/adresseopplysninger';
import { ISivilstatus } from '../models/steg/omDeg/sivilstatus';
import { IMedlemskap } from '../models/steg/omDeg/medlemskap';
import { IBosituasjon } from '../models/steg/bosituasjon';
import { IAktivitet } from '../models/steg/aktivitet/aktivitet';
import { IDinSituasjon } from '../models/steg/dinsituasjon/meromsituasjon';
import { SøknadOvergangsstønad } from '../søknader/overgangsstønad/models/søknad';
import { formatIsoDate } from '../utils/dato';
import { IBarn } from '../models/steg/barn';
import { MellomlagretSøknadOvergangsstønad } from '../søknader/overgangsstønad/models/mellomlagretSøknad';
import { SistInnsendteSøknad } from '../components/forside/TidligereInnsendteSøknaderAlert';
import { Stønadstype } from '../models/søknad/stønadstyper';
import axios from 'axios';
import Environment from '../Environment';
import { mockGet } from './axios';
import { render } from './render';
import { TestContainer } from './TestContainer';
import { Screen, waitFor, within } from '@testing-library/dom';
import { expect } from 'vitest';
import { UserEvent } from '@testing-library/user-event';
import { OvergangsstønadApp } from '../søknader/overgangsstønad/OvergangsstønadApp';

export const lagSøknadOvergangsstønad = (
  søknad?: Partial<SøknadOvergangsstønad>
): SøknadOvergangsstønad => {
  return {
    innsendingsdato: undefined,
    person: lagPerson(),
    søkerBorPåRegistrertAdresse: undefined,
    adresseopplysninger: undefined,
    sivilstatus: lagSivilstatus(),
    medlemskap: lagMedlemskap(),
    bosituasjon: lagBosituasjon(),
    aktivitet: lagAktivitet(),
    merOmDinSituasjon: lagDinSituasjon(),
    dokumentasjonsbehov: [],
    harBekreftet: false,
    locale: '',
    skalBehandlesINySaksbehandling: true,
    datoPåbegyntSøknad: undefined,
    ...søknad,
  };
};

export const lagDinSituasjon = (
  dinSituasjon?: Partial<IDinSituasjon>
): IDinSituasjon => {
  return {
    gjelderDetteDeg: lagSpørsmålListeFelt(),
    søknadsdato: undefined,
    sagtOppEllerRedusertStilling: undefined,
    begrunnelseSagtOppEllerRedusertStilling: undefined,
    datoSagtOppEllerRedusertStilling: undefined,
    søkerFraBestemtMåned: undefined,
    ...dinSituasjon,
  };
};

export const lagAktivitet = (aktivitet?: Partial<IAktivitet>): IAktivitet => {
  return {
    erIArbeid: undefined,
    hvaErDinArbeidssituasjon: lagSpørsmålListeFelt(),
    etablererEgenVirksomhet: lagSpørsmålFelt(),
    arbeidsforhold: undefined,
    datoOppstartJobb: undefined,
    arbeidssøker: undefined,
    egetAS: undefined,
    firma: undefined,
    firmaer: undefined,
    underUtdanning: undefined,
    ...aktivitet,
  };
};

export const lagSpørsmålListeFelt = (
  spørsmålid?: string,
  svarid?: string[],
  alternativer?: string[]
): ISpørsmålListeFelt => {
  return {
    spørsmålid: spørsmålid ?? '',
    svarid: svarid ?? [],
    alternativer: alternativer ?? [],
    ...lagTekstListeFelt(),
  };
};

export const lagTekstListeFelt = (
  label?: string,
  verdi?: string[]
): ITekstListeFelt => {
  return {
    label: label ?? '',
    verdi: verdi ?? [],
  };
};

export const lagBosituasjon = (
  bosituasjon?: Partial<IBosituasjon>
): IBosituasjon => {
  return {
    delerBoligMedAndreVoksne: lagSpørsmålFelt(),
    skalGifteSegEllerBliSamboer: lagSpørsmålBooleanFelt(),
    datoFlyttetSammenMedSamboer: undefined,
    datoSkalGifteSegEllerBliSamboer: undefined,
    datoFlyttetFraHverandre: undefined,
    samboerDetaljer: undefined,
    vordendeSamboerEktefelle: undefined,
    ...bosituasjon,
  };
};

export const lagSpørsmålBooleanFelt = (
  spørsmålid?: string,
  svarid?: string
): ISpørsmålBooleanFelt => {
  return {
    spørsmålid: spørsmålid ?? '',
    svarid: svarid ?? '',
    ...lagBooleanFelt(),
  };
};

export const lagSpørsmålFelt = (
  spørsmålid?: string,
  svarid?: string
): ISpørsmålFelt => {
  return {
    spørsmålid: spørsmålid ?? '',
    svarid: svarid ?? '',
    ...lagTekstfelt('', ''),
  };
};

export const lagTekstfelt = (label: string, verdi: string): ITekstFelt => {
  return { label: label, verdi: verdi };
};

export const lagBooleanFelt = (
  label?: string,
  verdi?: boolean
): IBooleanFelt => {
  return {
    label: label ?? '',
    verdi: verdi ?? false,
  };
};

export const lagMedlemskap = (
  medlemskap?: Partial<IMedlemskap>
): IMedlemskap => {
  return {
    søkerOppholderSegINorge: undefined,
    oppholdsland: undefined,
    søkerBosattINorgeSisteTreÅr: undefined,
    perioderBoddIUtlandet: undefined,
    ...medlemskap,
  };
};

export const lagSivilstatus = (
  sivilstatus?: Partial<ISivilstatus>
): ISivilstatus => {
  return {
    harSøktSeparasjon: undefined,
    datoSøktSeparasjon: undefined,
    erUformeltGift: undefined,
    erUformeltSeparertEllerSkilt: undefined,
    årsakEnslig: undefined,
    datoForSamlivsbrudd: undefined,
    datoFlyttetFraHverandre: undefined,
    datoEndretSamvær: undefined,
    tidligereSamboerDetaljer: undefined,
    ...sivilstatus,
  };
};

export const lagPerson = (person?: Partial<IPerson>): IPerson => {
  return {
    hash: 'hash',
    søker: lagSøker(),
    barn: [lagIBarn()],
    ...person,
  };
};

export const lagSøker = (søker?: Partial<Søker>): Søker => {
  return {
    fnr: '01012512345',
    alder: 25,
    forkortetNavn: '',
    adresse: lagAdresse(),
    sivilstand: 'UGIFT',
    statsborgerskap: 'NORGE',
    erStrengtFortrolig: false,
    ...søker,
  };
};

export const lagAdresse = (adresse?: Partial<Adresse>): Adresse => {
  return {
    adresse: 'Testveien 10',
    postnummer: '2407',
    poststed: 'Andeby',
    ...adresse,
  };
};

export const lagAdresseopplysninger = (
  opplysninger?: Partial<IAdresseopplysninger>
): IAdresseopplysninger => {
  return {
    harMeldtAdresseendring: undefined,
    ...opplysninger,
  };
};

export const lagBarn = (barn?: Partial<Barn>): Barn => {
  const dagensDato = new Date();
  dagensDato.setMonth(dagensDato.getMonth() - 1);

  return {
    alder: 10,
    fnr: '12345678910',
    fødselsdato: formatIsoDate(dagensDato),
    harAdressesperre: false,
    harSammeAdresse: false,
    medforelder: undefined,
    navn: 'Kjell Gunnar',
    ...barn,
  };
};

export const lagIBarn = (barn?: Partial<IBarn>): IBarn => {
  const dagensDato = new Date();
  dagensDato.setMonth(dagensDato.getMonth() - 1);

  return {
    id: '1234',
    fnr: undefined,
    alder: lagTekstfelt('', ''),
    fødselsdato: lagTekstfelt('', ''),
    ident: lagTekstfelt('', ''),
    harSammeAdresse: lagBooleanFelt('', true),
    navn: lagTekstfelt('', ''),
    født: undefined,
    lagtTil: undefined,
    forelder: undefined,
    særligeTilsynsbehov: undefined,
    skalHaBarnepass: undefined,
    barnepass: undefined,
    harAdressesperre: undefined,
    medforelder: undefined,
    annenForelderId: undefined,
    erFraForrigeSøknad: undefined,
    ...barn,
  };
};

export const lagPersonData = (personData?: Partial<PersonData>): PersonData => {
  return {
    søker: lagSøker(),
    barn: [lagBarn()],
    hash: 'hash',
    ...personData,
  };
};

export const lagMellomlagretSøknadOvergangsstønad = (
  søknad?: Partial<MellomlagretSøknadOvergangsstønad>
): MellomlagretSøknadOvergangsstønad => {
  return {
    søknad: lagSøknadOvergangsstønad(),
    modellVersjon: 7,
    gjeldendeSteg: '/',
    locale: '',
    ...søknad,
  };
};

export const lagSistInnsendteSøknad = (
  søknad?: Partial<SistInnsendteSøknad>
): SistInnsendteSøknad => {
  const dagensDato = new Date();
  dagensDato.setMonth(dagensDato.getMonth() - 1);

  return {
    søknadsdato: formatIsoDate(dagensDato),
    stønadType: Stønadstype.overgangsstønad,
    ...søknad,
  };
};

export const settOppMellomlagretSøknad = (søker?: Partial<Søker>) => {
  (axios.get as any).mockImplementation((url: string) => {
    if (url === `${Environment().mellomlagerProxyUrl + 'overgangsstonad'}`) {
      return Promise.resolve({
        data: lagMellomlagretSøknadOvergangsstønad({
          søknad: lagSøknadOvergangsstønad({ harBekreftet: true }),
          gjeldendeSteg: '/om-deg',
        }),
      });
    }

    if (url === `${Environment().apiProxyUrl}/api/oppslag/sokerinfo`) {
      return Promise.resolve({
        data: lagPerson({
          søker: lagSøker({ ...søker }),
        }),
      });
    }

    return mockGet(url, 'overgangsstonad');
  });
};

export const navigerTilOmDeg = async () => {
  const { screen, user } = render(
    <TestContainer>
      <OvergangsstønadApp />
    </TestContainer>
  );

  await waitFor(() => {
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Søknad om overgangsstønad',
      })
    ).toBeInTheDocument();
  });

  await user.click(
    screen.getByRole('button', {
      name: 'Fortsett på søknaden',
    })
  );

  return { screen, user };
};

export const klikkSvarRadioknapp = async (
  groupName: string,
  radioLabel: string,
  screen: Screen,
  user: UserEvent
) => {
  const radioGroup = screen.getByRole('group', { name: groupName });
  const radio = within(radioGroup).getByRole('radio', { name: radioLabel });
  await user.click(radio);
};
