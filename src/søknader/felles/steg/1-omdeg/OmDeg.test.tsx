import { describe, expect, test, vi } from 'vitest';
import { mockGet, mockMellomlagretSøknadOvergangsstønad } from '../../../../test/axios';
import {
  klikkButton,
  klikkButtonIListe,
  klikkCheckbox,
  klikkRadioknapp,
  navigerTilStegOvergangsstønad,
  skrivFritekst,
  velgAlternativCombobox,
} from '../../../../test/aksjoner';
import { dagensDato, datoEnMånedTilbake } from '../../../../test/dato';

vi.mock('axios', () => {
  return {
    default: {
      get: vi.fn((url: string) => mockGet(url, 'overgangsstonad')),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    },
  };
});

describe('OmDegSteg, personopplysninger', () => {
  test('Skal navigere til om-deg fra mellomlagret søknad', async () => {
    mockMellomlagretSøknadOvergangsstønad('/om-deg');
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(screen.getByRole('heading', { level: 2, name: 'Om deg' })).toBeInTheDocument();
  });

  test('Rendre spørsmål om uformelt gift dersom bruker er ugift og borPåAdresse er ja', async () => {
    mockMellomlagretSøknadOvergangsstønad('/om-deg');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor du på denne adressen?', 'Ja', screen, user);

    expect(
      screen.getByRole('group', {
        name: 'Er du gift uten at det er registrert i folkeregisteret i Norge? Hvorfor spør vi om dette? Vi henter opplysningene våre fra Folkeregisteret. Hvis du har giftet deg etter religiøse eller kulturelle tradisjoner og ekteskapet ikke er godkjent etter norsk ekteskapslov, er ikke giftemålet registrert i Folkeregisteret.',
      })
    ).toBeInTheDocument();
  });

  test('Rendrer spørsmål om separasjon dersom bruker er gift og borPåAdresse er ja', async () => {
    mockMellomlagretSøknadOvergangsstønad('/om-deg', {
      sivilstand: 'GIFT',
    });
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor du på denne adressen?', 'Ja', screen, user);

    expect(
      screen.getByRole('group', {
        name: 'Har dere søkt om separasjon, søkt om skilsmisse eller reist sak for domstolen?',
      })
    ).toBeInTheDocument();
  });

  test('Rendre spørsmål og info om adresseendring dersom borPåAdresse er nei', async () => {
    mockMellomlagretSøknadOvergangsstønad('/om-deg');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor du på denne adressen?', 'Nei', screen, user);

    expect(
      screen.getByRole('group', {
        name: 'Har du meldt adresseendring til Folkeregisteret?',
      })
    ).toBeInTheDocument();

    await klikkRadioknapp('Har du meldt adresseendring til Folkeregisteret?', 'Ja', screen, user);

    expect(
      screen.getByText(
        'Du må legge ved dokumentasjon på at du har meldt flytting til Folkeregisteret. Dokumentasjonen må vise at det er du som har endret adresse, hvilken adresse du har meldt flytting til og hvilken dato du flyttet.'
      )
    ).toBeInTheDocument();

    await klikkRadioknapp('Har du meldt adresseendring til Folkeregisteret?', 'Nei', screen, user);

    expect(
      screen.getByText((tekst) =>
        tekst.includes('Du må ha meldt adresseendring til Folkeregisteret')
      )
    ).toBeInTheDocument();
  });

  test('Skal skjule adresseendring-spørsmål når bruker endrer svar fra nei til ja på borPåAdresse', async () => {
    mockMellomlagretSøknadOvergangsstønad('/om-deg');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor du på denne adressen?', 'Nei', screen, user);

    expect(
      screen.getByRole('group', {
        name: 'Har du meldt adresseendring til Folkeregisteret?',
      })
    ).toBeInTheDocument();

    await klikkRadioknapp('Har du meldt adresseendring til Folkeregisteret?', 'Nei', screen, user);

    expect(
      screen.getByText((tekst) =>
        tekst.includes('Du må ha meldt adresseendring til Folkeregisteret')
      )
    ).toBeInTheDocument();

    await klikkRadioknapp('Bor du på denne adressen?', 'Ja', screen, user);

    expect(
      screen.queryByRole('group', {
        name: 'Har du meldt adresseendring til Folkeregisteret?',
      })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText((tekst) =>
        tekst.includes('Du må ha meldt adresseendring til Folkeregisteret')
      )
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('group', {
        name: 'Er du gift uten at det er registrert i folkeregisteret i Norge? Hvorfor spør vi om dette? Vi henter opplysningene våre fra Folkeregisteret. Hvis du har giftet deg etter religiøse eller kulturelle tradisjoner og ekteskapet ikke er godkjent etter norsk ekteskapslov, er ikke giftemålet registrert i Folkeregisteret.',
      })
    ).toBeInTheDocument();
  });

  test('Skal skjule og cleare sivilstatus og medlemskap når bruker endrer fra ja til nei-nei på adressespørsmål', async () => {
    mockMellomlagretSøknadOvergangsstønad('/om-deg');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor du på denne adressen?', 'Ja', screen, user);

    await klikkRadioknapp(
      'Er du gift uten at det er registrert i folkeregisteret i Norge? Hvorfor spør vi om dette? Vi henter opplysningene våre fra Folkeregisteret. Hvis du har giftet deg etter religiøse eller kulturelle tradisjoner og ekteskapet ikke er godkjent etter norsk ekteskapslov, er ikke giftemålet registrert i Folkeregisteret.',
      'Nei',
      screen,
      user
    );
    await klikkRadioknapp(
      'Er du separert eller skilt uten at dette er registrert i folkeregisteret i Norge?',
      'Nei',
      screen,
      user
    );
    await klikkRadioknapp(
      'Hvorfor er du alene med barn? Grunnen til at vi spør om dette Vi spør om dette for å vite hvilken informasjon vi trenger fra deg.',
      'Jeg er alene med barn på grunn av dødsfall',
      screen,
      user
    );

    await klikkRadioknapp('Oppholder du og barnet/barna dere i Norge?', 'Ja', screen, user);
    await klikkRadioknapp('Har du oppholdt deg i Norge de siste 5 årene?', 'Ja', screen, user);

    expect(
      screen.getByRole('group', {
        name: 'Oppholder du og barnet/barna dere i Norge?',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('group', {
        name: 'Har du oppholdt deg i Norge de siste 5 årene?',
      })
    ).toBeInTheDocument();

    await klikkRadioknapp('Bor du på denne adressen?', 'Nei', screen, user);

    expect(
      screen.queryByRole('group', {
        name: 'Oppholder du og barnet/barna dere i Norge?',
      })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('group', {
        name: 'Har du oppholdt deg i Norge de siste 5 årene?',
      })
    ).not.toBeInTheDocument();

    await klikkRadioknapp('Har du meldt adresseendring til Folkeregisteret?', 'Nei', screen, user);

    expect(
      screen.queryByRole('group', {
        name: 'Oppholder du og barnet/barna dere i Norge?',
      })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('group', {
        name: 'Har du oppholdt deg i Norge de siste 5 årene?',
      })
    ).not.toBeInTheDocument();
  });
});

describe('OmDegSteg, sivilstatus', () => {
  test('Rendrer spørsmål om uregistrert gift/skilt/separert dersom bruker er ugift', async () => {
    mockMellomlagretSøknadOvergangsstønad('/om-deg');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor du på denne adressen?', 'Ja', screen, user);

    expect(
      screen.getByRole('group', {
        name: 'Er du gift uten at det er registrert i folkeregisteret i Norge? Hvorfor spør vi om dette? Vi henter opplysningene våre fra Folkeregisteret. Hvis du har giftet deg etter religiøse eller kulturelle tradisjoner og ekteskapet ikke er godkjent etter norsk ekteskapslov, er ikke giftemålet registrert i Folkeregisteret.',
      })
    ).toBeInTheDocument();

    await klikkRadioknapp(
      'Er du gift uten at det er registrert i folkeregisteret i Norge? Hvorfor spør vi om dette? Vi henter opplysningene våre fra Folkeregisteret. Hvis du har giftet deg etter religiøse eller kulturelle tradisjoner og ekteskapet ikke er godkjent etter norsk ekteskapslov, er ikke giftemålet registrert i Folkeregisteret.',
      'Ja',
      screen,
      user
    );

    expect(
      screen.getByText('Du må legge ved dokumentasjon på inngått ekteskap')
    ).toBeInTheDocument();

    expect(
      screen.getByRole('group', {
        name: 'Er du separert eller skilt uten at dette er registrert i folkeregisteret i Norge?',
      })
    ).toBeInTheDocument();

    await klikkRadioknapp(
      'Er du gift uten at det er registrert i folkeregisteret i Norge? Hvorfor spør vi om dette? Vi henter opplysningene våre fra Folkeregisteret. Hvis du har giftet deg etter religiøse eller kulturelle tradisjoner og ekteskapet ikke er godkjent etter norsk ekteskapslov, er ikke giftemålet registrert i Folkeregisteret.',
      'Nei',
      screen,
      user
    );

    expect(
      screen.queryByText('Du må legge ved dokumentasjon på inngått ekteskap')
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole('group', {
        name: 'Er du separert eller skilt uten at dette er registrert i folkeregisteret i Norge?',
      })
    ).toBeInTheDocument();
  });

  test('Rendrer spørsmål om uregistrert gift/skilt/separert dersom bruker er gift', async () => {
    mockMellomlagretSøknadOvergangsstønad('/om-deg', { sivilstand: 'GIFT' });
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor du på denne adressen?', 'Ja', screen, user);

    expect(
      screen.getByRole('group', {
        name: 'Har dere søkt om separasjon, søkt om skilsmisse eller reist sak for domstolen?',
      })
    ).toBeInTheDocument();

    await klikkRadioknapp(
      'Har dere søkt om separasjon, søkt om skilsmisse eller reist sak for domstolen?',
      'Nei',
      screen,
      user
    );

    expect(
      screen.getByText('Når du er gift, har du ikke rett til stønad til enslig mor eller far')
    ).toBeInTheDocument();

    expect(
      screen.getByRole('group', {
        name: 'Hvorfor er du alene med barn? Grunnen til at vi spør om dette Vi spør om dette for å vite hvilken informasjon vi trenger fra deg.',
      })
    ).toBeInTheDocument();

    await klikkRadioknapp(
      'Har dere søkt om separasjon, søkt om skilsmisse eller reist sak for domstolen?',
      'Ja',
      screen,
      user
    );

    expect(
      screen.queryByText('Når du er gift, har du ikke rett til stønad til enslig mor eller far')
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole('textbox', {
        name: 'Når søkte dere eller reiste sak?',
      })
    ).toBeInTheDocument();

    await user.type(
      screen.getByRole('textbox', { name: 'Når søkte dere eller reiste sak?' }),
      '02.06.2025'
    );

    expect(screen.getByText('Du må legge ved bekreftelse fra Statsforvalteren eller domstolen.'));

    expect(
      screen.getByRole('group', {
        name: 'Hvorfor er du alene med barn? Grunnen til at vi spør om dette Vi spør om dette for å vite hvilken informasjon vi trenger fra deg.',
      })
    ).toBeInTheDocument();
  });

  test('Rendrer felt for årsak:samlivsbrudd med den andre forelderen, samt nestehovedspørsmål', async () => {
    mockMellomlagretSøknadOvergangsstønad('/om-deg');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor du på denne adressen?', 'Ja', screen, user);

    await klikkRadioknapp(
      'Er du gift uten at det er registrert i folkeregisteret i Norge? Hvorfor spør vi om dette? Vi henter opplysningene våre fra Folkeregisteret. Hvis du har giftet deg etter religiøse eller kulturelle tradisjoner og ekteskapet ikke er godkjent etter norsk ekteskapslov, er ikke giftemålet registrert i Folkeregisteret.',
      'Nei',
      screen,
      user
    );

    await klikkRadioknapp(
      'Er du separert eller skilt uten at dette er registrert i folkeregisteret i Norge?',
      'Nei',
      screen,
      user
    );

    await klikkRadioknapp(
      'Hvorfor er du alene med barn? Grunnen til at vi spør om dette Vi spør om dette for å vite hvilken informasjon vi trenger fra deg.',
      'Samlivsbrudd med den andre forelderen',
      screen,
      user
    );

    await user.type(screen.getByRole('textbox', { name: 'Dato for samlivsbrudd' }), '02.06.2025');

    expect(
      screen.getByRole('group', {
        name: 'Oppholder du og barnet/barna dere i Norge?',
      })
    );
  });

  test('Rendrer felt for årsak:samlivsbrudd med noen andre, samt neste nestehovedspørsmål', async () => {
    mockMellomlagretSøknadOvergangsstønad('/om-deg');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor du på denne adressen?', 'Ja', screen, user);

    await klikkRadioknapp(
      'Er du gift uten at det er registrert i folkeregisteret i Norge? Hvorfor spør vi om dette? Vi henter opplysningene våre fra Folkeregisteret. Hvis du har giftet deg etter religiøse eller kulturelle tradisjoner og ekteskapet ikke er godkjent etter norsk ekteskapslov, er ikke giftemålet registrert i Folkeregisteret.',
      'Nei',
      screen,
      user
    );

    await klikkRadioknapp(
      'Er du separert eller skilt uten at dette er registrert i folkeregisteret i Norge?',
      'Nei',
      screen,
      user
    );

    await klikkRadioknapp(
      'Hvorfor er du alene med barn? Grunnen til at vi spør om dette Vi spør om dette for å vite hvilken informasjon vi trenger fra deg.',
      'Samlivsbrudd med noen andre',
      screen,
      user
    );

    expect(screen.getByRole('textbox', { name: 'Navn' })).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', {
        name: 'Fødselsnummer / d-nummer (11 siffer)',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg kjenner ikke fødselsnummer / d-nummer',
      })
    ).toBeInTheDocument();

    await user.type(screen.getByRole('textbox', { name: 'Navn' }), 'Ola Nordmann');

    await user.type(
      screen.getByRole('textbox', {
        name: 'Fødselsnummer / d-nummer (11 siffer)',
      }),
      '1234'
    );

    expect(screen.getByText('Ugyldig fødselsnummer eller d-nummer')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Når flyttet dere fra hverandre?' }));
    expect(screen.getByRole('button', { name: 'Åpne datovelger' })).toBeInTheDocument();

    await user.clear(
      screen.getByRole('textbox', {
        name: 'Fødselsnummer / d-nummer (11 siffer)',
      })
    );

    await user.type(
      screen.getByRole('textbox', {
        name: 'Fødselsnummer / d-nummer (11 siffer)',
      }),
      '09469425085'
    );

    await user.type(
      screen.getByRole('textbox', { name: 'Når flyttet dere fra hverandre?' }),
      '02.06.2025'
    );

    expect(
      screen.getByRole('group', {
        name: 'Oppholder du og barnet/barna dere i Norge?',
      })
    ).toBeInTheDocument();
  });

  test('Navn, avhuket kjennerIkkeIdent og fødselsdato skal rendre neste hovedspørsmål', async () => {
    mockMellomlagretSøknadOvergangsstønad('/om-deg');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor du på denne adressen?', 'Ja', screen, user);

    await klikkRadioknapp(
      'Er du gift uten at det er registrert i folkeregisteret i Norge? Hvorfor spør vi om dette? Vi henter opplysningene våre fra Folkeregisteret. Hvis du har giftet deg etter religiøse eller kulturelle tradisjoner og ekteskapet ikke er godkjent etter norsk ekteskapslov, er ikke giftemålet registrert i Folkeregisteret.',
      'Nei',
      screen,
      user
    );

    await klikkRadioknapp(
      'Er du separert eller skilt uten at dette er registrert i folkeregisteret i Norge?',
      'Nei',
      screen,
      user
    );

    await klikkRadioknapp(
      'Hvorfor er du alene med barn? Grunnen til at vi spør om dette Vi spør om dette for å vite hvilken informasjon vi trenger fra deg.',
      'Samlivsbrudd med noen andre',
      screen,
      user
    );

    expect(
      screen.getByRole('textbox', {
        name: 'Navn',
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('textbox', {
        name: 'Fødselsnummer / d-nummer (11 siffer)',
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('checkbox', {
        name: 'Jeg kjenner ikke fødselsnummer / d-nummer',
      })
    ).toBeInTheDocument();

    await skrivFritekst('Navn', 'Ola Nordmann', screen, user);

    await klikkCheckbox('Jeg kjenner ikke fødselsnummer / d-nummer', screen, user);

    await user.type(screen.getByRole('textbox', { name: 'Fødselsdato' }), '02.06.1990');

    expect(screen.getByRole('textbox', { name: 'Fødselsdato' })).toHaveValue('02.06.1990');

    await user.type(
      screen.getByRole('textbox', { name: 'Når flyttet dere fra hverandre?' }),
      '02.06.2025'
    );

    expect(screen.getByRole('textbox', { name: 'Når flyttet dere fra hverandre?' })).toHaveValue(
      '02.06.2025'
    );

    expect(
      screen.getByRole('group', {
        name: 'Oppholder du og barnet/barna dere i Norge?',
      })
    ).toBeInTheDocument();
  });

  test('Rendrer neste hovedspørsmål etter årsak:alene med barn fra fødsel', async () => {
    mockMellomlagretSøknadOvergangsstønad('/om-deg');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor du på denne adressen?', 'Ja', screen, user);

    await klikkRadioknapp(
      'Er du gift uten at det er registrert i folkeregisteret i Norge? Hvorfor spør vi om dette? Vi henter opplysningene våre fra Folkeregisteret. Hvis du har giftet deg etter religiøse eller kulturelle tradisjoner og ekteskapet ikke er godkjent etter norsk ekteskapslov, er ikke giftemålet registrert i Folkeregisteret.',
      'Nei',
      screen,
      user
    );

    await klikkRadioknapp(
      'Er du separert eller skilt uten at dette er registrert i folkeregisteret i Norge?',
      'Nei',
      screen,
      user
    );

    await klikkRadioknapp(
      'Hvorfor er du alene med barn? Grunnen til at vi spør om dette Vi spør om dette for å vite hvilken informasjon vi trenger fra deg.',
      'Jeg er alene med barn fra fødsel',
      screen,
      user
    );

    expect(
      screen.getByRole('group', {
        name: 'Oppholder du og barnet/barna dere i Norge?',
      })
    ).toBeInTheDocument();
  });

  test('Rendrer felt for årsak:endring i omsorg for barn, samnt neste hovedspørsmål', async () => {
    mockMellomlagretSøknadOvergangsstønad('/om-deg');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor du på denne adressen?', 'Ja', screen, user);

    await klikkRadioknapp(
      'Er du gift uten at det er registrert i folkeregisteret i Norge? Hvorfor spør vi om dette? Vi henter opplysningene våre fra Folkeregisteret. Hvis du har giftet deg etter religiøse eller kulturelle tradisjoner og ekteskapet ikke er godkjent etter norsk ekteskapslov, er ikke giftemålet registrert i Folkeregisteret.',
      'Nei',
      screen,
      user
    );

    await klikkRadioknapp(
      'Er du separert eller skilt uten at dette er registrert i folkeregisteret i Norge?',
      'Nei',
      screen,
      user
    );

    await klikkRadioknapp(
      'Hvorfor er du alene med barn? Grunnen til at vi spør om dette Vi spør om dette for å vite hvilken informasjon vi trenger fra deg.',
      'Endring i omsorgen for barn',
      screen,
      user
    );

    await user.type(
      screen.getByRole('textbox', {
        name: 'Når skjedde endringen / når skal endringen skje?',
      }),
      '02.06.2025'
    );

    expect(
      screen.getByRole('group', {
        name: 'Oppholder du og barnet/barna dere i Norge?',
      })
    ).toBeInTheDocument();
  });

  test('Rendrer infoboks årsak:alene pga. dødsfall, samnt neste hovedspørsmål', async () => {
    mockMellomlagretSøknadOvergangsstønad('/om-deg');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor du på denne adressen?', 'Ja', screen, user);

    await klikkRadioknapp(
      'Er du gift uten at det er registrert i folkeregisteret i Norge? Hvorfor spør vi om dette? Vi henter opplysningene våre fra Folkeregisteret. Hvis du har giftet deg etter religiøse eller kulturelle tradisjoner og ekteskapet ikke er godkjent etter norsk ekteskapslov, er ikke giftemålet registrert i Folkeregisteret.',
      'Nei',
      screen,
      user
    );

    await klikkRadioknapp(
      'Er du separert eller skilt uten at dette er registrert i folkeregisteret i Norge?',
      'Nei',
      screen,
      user
    );

    await klikkRadioknapp(
      'Hvorfor er du alene med barn? Grunnen til at vi spør om dette Vi spør om dette for å vite hvilken informasjon vi trenger fra deg.',
      'Jeg er alene med barn på grunn av dødsfall',
      screen,
      user
    );

    expect(
      screen.getByText(
        'Når du er alene med barn på grunn av dødsfall, kan du ha rett til stønad til',
        { exact: false } // De siste ordene er lenker, de sjekkes under
      )
    ).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'gjenlevende' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'barnepensjon' })).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'gjenlevende' })).toHaveAttribute(
      'href',
      'https://www.nav.no/no/person/pensjon/andre-pensjonsordninger/ytelser-til-gjenlevende-ektefelle'
    );
    expect(screen.getByRole('link', { name: 'barnepensjon' })).toHaveAttribute(
      'href',
      'https://www.nav.no/no/person/pensjon/andre-pensjonsordninger/barnepensjon'
    );

    expect(
      screen.getByRole('group', {
        name: 'Oppholder du og barnet/barna dere i Norge?',
      })
    ).toBeInTheDocument();
  });
});

describe('OmDegSteg, medlemskap', () => {
  test('Skal kunne navigere til neste steg ved ferdige utfylte verdier for medlemskap', async () => {
    mockMellomlagretSøknadOvergangsstønad('/om-deg');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor du på denne adressen?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Er du gift uten at det er registrert i folkeregisteret i Norge? Hvorfor spør vi om dette? Vi henter opplysningene våre fra Folkeregisteret. Hvis du har giftet deg etter religiøse eller kulturelle tradisjoner og ekteskapet ikke er godkjent etter norsk ekteskapslov, er ikke giftemålet registrert i Folkeregisteret.',
      'Nei',
      screen,
      user
    );
    await klikkRadioknapp(
      'Er du separert eller skilt uten at dette er registrert i folkeregisteret i Norge?',
      'Nei',
      screen,
      user
    );
    await klikkRadioknapp(
      'Hvorfor er du alene med barn? Grunnen til at vi spør om dette Vi spør om dette for å vite hvilken informasjon vi trenger fra deg.',
      'Jeg er alene med barn på grunn av dødsfall',
      screen,
      user
    );

    await klikkRadioknapp('Oppholder du og barnet/barna dere i Norge?', 'Ja', screen, user);
    expect(
      screen.getByRole('group', {
        name: 'Har du oppholdt deg i Norge de siste 5 årene?',
      })
    ).toBeInTheDocument();

    await klikkRadioknapp('Har du oppholdt deg i Norge de siste 5 årene?', 'Ja', screen, user);
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();

    await klikkRadioknapp('Har du oppholdt deg i Norge de siste 5 årene?', 'Nei', screen, user);
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Utenlandsperiode' })).toBeInTheDocument();
    expect(screen.getByText('Når oppholdt du deg i utlandet?')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Fra' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Til' })).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', {
        name: 'I hvilket land oppholdt du deg i?',
      })
    ).toBeInTheDocument();

    await skrivFritekst('Fra', datoEnMånedTilbake, screen, user);
    await skrivFritekst('Til', dagensDato, screen, user);
    await velgAlternativCombobox('I hvilket land oppholdt du deg i?', 'Brasil', screen, user);
    expect(
      screen.getByRole('textbox', { name: 'Hvorfor oppholdt du deg i Brasil?' })
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();

    await skrivFritekst('Hvorfor oppholdt du deg i Brasil?', 'På grunn av familien', screen, user);
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Legg til et utenlandsopphold' })
    ).toBeInTheDocument();

    await klikkButton('Legg til et utenlandsopphold', screen, user);
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Fjern utenlandsperiode' }).length).toBe(2);

    await klikkButtonIListe('Fjern utenlandsperiode', 1, screen, user);
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Fjern utenlandsperiode' })
    ).not.toBeInTheDocument();

    await klikkRadioknapp('Oppholder du og barnet/barna dere i Norge?', 'Nei', screen, user);
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(
      screen.getByRole('combobox', {
        name: 'Hvor oppholder du og barnet/barna dere?',
      })
    ).toBeInTheDocument();

    await velgAlternativCombobox(
      'Hvor oppholder du og barnet/barna dere?',
      'Algerie',
      screen,
      user
    );
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();

    await velgAlternativCombobox('I hvilket land oppholdt du deg i?', 'Danmark', screen, user);
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Hvorfor oppholdt du deg i Danmark?' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Hva er id-nummeret ditt i Danmark?' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Jeg har ikke id-nummer i Danmark' })
    ).toBeInTheDocument();

    await skrivFritekst('Hva er id-nummeret ditt i Danmark?', '27909698168', screen, user);
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Hva er den siste adressen du bodde på i Danmark?' })
    ).toBeInTheDocument();

    await skrivFritekst(
      'Hva er den siste adressen du bodde på i Danmark?',
      'Galtvort',
      screen,
      user
    );
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();

    await klikkCheckbox('Jeg har ikke id-nummer i Danmark', screen, user);
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Hva er id-nummeret ditt i Danmark?' })
    ).toBeDisabled();
  });

  test('Rendrer felt og neste spm, dersom bruker ikke oppholder seg i Norge', async () => {
    mockMellomlagretSøknadOvergangsstønad('/om-deg');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor du på denne adressen?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Er du gift uten at det er registrert i folkeregisteret i Norge? Hvorfor spør vi om dette? Vi henter opplysningene våre fra Folkeregisteret. Hvis du har giftet deg etter religiøse eller kulturelle tradisjoner og ekteskapet ikke er godkjent etter norsk ekteskapslov, er ikke giftemålet registrert i Folkeregisteret.',
      'Nei',
      screen,
      user
    );
    await klikkRadioknapp(
      'Er du separert eller skilt uten at dette er registrert i folkeregisteret i Norge?',
      'Nei',
      screen,
      user
    );
    await klikkRadioknapp(
      'Hvorfor er du alene med barn? Grunnen til at vi spør om dette Vi spør om dette for å vite hvilken informasjon vi trenger fra deg.',
      'Jeg er alene med barn på grunn av dødsfall',
      screen,
      user
    );

    await klikkRadioknapp('Oppholder du og barnet/barna dere i Norge?', 'Nei', screen, user);

    expect(
      screen.getByRole('combobox', {
        name: 'Hvor oppholder du og barnet/barna dere?',
      })
    ).toBeInTheDocument();

    await user.selectOptions(
      screen.getByRole('combobox', {
        name: 'Hvor oppholder du og barnet/barna dere?',
      }),
      'Belgia'
    );

    expect(
      screen.getByRole('group', {
        name: 'Har du oppholdt deg i Norge de siste 5 årene?',
      })
    ).toBeInTheDocument();
  });

  test('Rendrer neste-steg knapp, dersom bruker har oppholdt seg i Norge siste 5 år', async () => {
    mockMellomlagretSøknadOvergangsstønad('/om-deg');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor du på denne adressen?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Er du gift uten at det er registrert i folkeregisteret i Norge? Hvorfor spør vi om dette? Vi henter opplysningene våre fra Folkeregisteret. Hvis du har giftet deg etter religiøse eller kulturelle tradisjoner og ekteskapet ikke er godkjent etter norsk ekteskapslov, er ikke giftemålet registrert i Folkeregisteret.',
      'Nei',
      screen,
      user
    );
    await klikkRadioknapp(
      'Er du separert eller skilt uten at dette er registrert i folkeregisteret i Norge?',
      'Nei',
      screen,
      user
    );
    await klikkRadioknapp(
      'Hvorfor er du alene med barn? Grunnen til at vi spør om dette Vi spør om dette for å vite hvilken informasjon vi trenger fra deg.',
      'Jeg er alene med barn på grunn av dødsfall',
      screen,
      user
    );

    await klikkRadioknapp('Oppholder du og barnet/barna dere i Norge?', 'Ja', screen, user);

    await klikkRadioknapp('Har du oppholdt deg i Norge de siste 5 årene?', 'Ja', screen, user);

    expect(screen.getByRole('button', { name: 'Neste' }));
  });

  test('Rendrer felter og neste-steg knapp, dersom bruker ikke har oppholdt seg i Norge siste 5 år (IKKE EØS)', async () => {
    mockMellomlagretSøknadOvergangsstønad('/om-deg');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor du på denne adressen?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Er du gift uten at det er registrert i folkeregisteret i Norge? Hvorfor spør vi om dette? Vi henter opplysningene våre fra Folkeregisteret. Hvis du har giftet deg etter religiøse eller kulturelle tradisjoner og ekteskapet ikke er godkjent etter norsk ekteskapslov, er ikke giftemålet registrert i Folkeregisteret.',
      'Nei',
      screen,
      user
    );
    await klikkRadioknapp(
      'Er du separert eller skilt uten at dette er registrert i folkeregisteret i Norge?',
      'Nei',
      screen,
      user
    );
    await klikkRadioknapp(
      'Hvorfor er du alene med barn? Grunnen til at vi spør om dette Vi spør om dette for å vite hvilken informasjon vi trenger fra deg.',
      'Jeg er alene med barn på grunn av dødsfall',
      screen,
      user
    );

    await klikkRadioknapp('Oppholder du og barnet/barna dere i Norge?', 'Ja', screen, user);

    await klikkRadioknapp('Har du oppholdt deg i Norge de siste 5 årene?', 'Nei', screen, user);

    await user.type(screen.getByRole('textbox', { name: 'Fra' }), '02.06.2019');

    await user.type(screen.getByRole('textbox', { name: 'Til' }), '02.06.2025');

    await user.selectOptions(
      screen.getByRole('combobox', {
        name: 'I hvilket land oppholdt du deg i?',
      }),
      'Brasil'
    );

    await user.type(
      screen.getByRole('textbox', {
        name: 'Hvorfor oppholdt du deg i Brasil?',
      }),
      'Var på stranda'
    );

    expect(screen.getByText('Har du hatt flere utenlandsopphold de siste 5 årene?'));

    expect(screen.getByRole('button', { name: 'Legg til et utenlandsopphold' }));

    expect(screen.getByRole('button', { name: 'Neste' }));
  });

  test('Rendrer felter og neste-steg knapp, dersom bruker ikke har oppholdt seg i Norge siste 5 år (EØS)', async () => {
    mockMellomlagretSøknadOvergangsstønad('/om-deg');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    await klikkRadioknapp('Bor du på denne adressen?', 'Ja', screen, user);
    await klikkRadioknapp(
      'Er du gift uten at det er registrert i folkeregisteret i Norge? Hvorfor spør vi om dette? Vi henter opplysningene våre fra Folkeregisteret. Hvis du har giftet deg etter religiøse eller kulturelle tradisjoner og ekteskapet ikke er godkjent etter norsk ekteskapslov, er ikke giftemålet registrert i Folkeregisteret.',
      'Nei',
      screen,
      user
    );
    await klikkRadioknapp(
      'Er du separert eller skilt uten at dette er registrert i folkeregisteret i Norge?',
      'Nei',
      screen,
      user
    );
    await klikkRadioknapp(
      'Hvorfor er du alene med barn? Grunnen til at vi spør om dette Vi spør om dette for å vite hvilken informasjon vi trenger fra deg.',
      'Jeg er alene med barn på grunn av dødsfall',
      screen,
      user
    );

    await klikkRadioknapp('Oppholder du og barnet/barna dere i Norge?', 'Ja', screen, user);

    await klikkRadioknapp('Har du oppholdt deg i Norge de siste 5 årene?', 'Nei', screen, user);

    await user.type(screen.getByRole('textbox', { name: 'Fra' }), '02.06.2019');

    await user.type(screen.getByRole('textbox', { name: 'Til' }), '02.06.2025');

    await user.selectOptions(
      screen.getByRole('combobox', {
        name: 'I hvilket land oppholdt du deg i?',
      }),
      'Belgia'
    );

    await user.type(
      screen.getByRole('textbox', {
        name: 'Hvorfor oppholdt du deg i Belgia?',
      }),
      'Spiste sjokolade'
    );

    await user.type(
      screen.getByRole('textbox', {
        name: 'Hva er id-nummeret ditt i Belgia?',
      }),
      '123'
    );

    expect(
      screen.getByRole('textbox', {
        name: 'Hva er den siste adressen du bodde på i Belgia?',
      })
    ).toBeInTheDocument();

    await user.clear(
      screen.getByRole('textbox', {
        name: 'Hva er id-nummeret ditt i Belgia?',
      })
    );

    expect(
      screen.queryByRole('textbox', {
        name: 'Hva er den siste adressen du bodde på i Belgia?',
      })
    ).not.toBeInTheDocument();

    await klikkCheckbox('Jeg har ikke id-nummer i Belgia', screen, user);

    expect(
      screen.getByRole('textbox', {
        name: 'Hva er den siste adressen du bodde på i Belgia?',
      })
    ).toBeInTheDocument();

    await user.type(
      screen.getByRole('textbox', {
        name: 'Hva er den siste adressen du bodde på i Belgia?',
      }),
      'Fyrstikkaleen 1'
    );

    expect(screen.getByText('Har du hatt flere utenlandsopphold de siste 5 årene?'));

    expect(screen.getByRole('button', { name: 'Legg til et utenlandsopphold' }));

    expect(screen.getByRole('button', { name: 'Neste' }));
  }, 10000);
});
