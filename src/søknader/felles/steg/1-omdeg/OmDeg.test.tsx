import { describe, expect, test, vi } from 'vitest';
import { mockGet, settOppMellomlagretSøknad } from '../../../../test/axios';
import {
  klikkCheckbox,
  klikkSvarRadioknapp,
  navigerTilOmDeg,
  skrivFritekst,
} from '../../../../test/actions';

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
    settOppMellomlagretSøknad();
    const { screen } = await navigerTilOmDeg();

    expect(
      screen.getByRole('heading', { level: 2, name: 'Om deg' })
    ).toBeInTheDocument();
  });

  test('Rendre spørsmål om uformelt gift dersom bruker er ugift og borPåAdresse er ja', async () => {
    settOppMellomlagretSøknad();
    const { screen, user } = await navigerTilOmDeg();

    await klikkSvarRadioknapp('Bor du på denne adressen?', 'Ja', screen, user);

    expect(
      screen.getByRole('group', {
        name: 'Er du gift uten at det er registrert i folkeregisteret i Norge?',
      })
    ).toBeInTheDocument();
  });

  test('Rendrer spørsmål om separasjon dersom bruker er gift og borPåAdresse er ja', async () => {
    settOppMellomlagretSøknad({ sivilstand: 'GIFT' });
    const { screen, user } = await navigerTilOmDeg();

    await klikkSvarRadioknapp('Bor du på denne adressen?', 'Ja', screen, user);

    expect(
      screen.getByRole('group', {
        name: 'Har dere søkt om separasjon, søkt om skilsmisse eller reist sak for domstolen?',
      })
    ).toBeInTheDocument();
  });

  test('Rendre spørsmål og info om adresseendring dersom borPåAdresse er nei', async () => {
    settOppMellomlagretSøknad();
    const { screen, user } = await navigerTilOmDeg();

    await klikkSvarRadioknapp('Bor du på denne adressen?', 'Nei', screen, user);

    expect(
      screen.getByRole('group', {
        name: 'Har du meldt adresseendring til Folkeregisteret?',
      })
    ).toBeInTheDocument();

    await klikkSvarRadioknapp(
      'Har du meldt adresseendring til Folkeregisteret?',
      'Ja',
      screen,
      user
    );

    expect(
      screen.getByText(
        'Du må legge ved dokumentasjon på at du har meldt flytting til Folkeregisteret. Dokumentasjonen må vise at det er du som har endret adresse, hvilken adresse du har meldt flytting til og hvilken dato du flyttet.'
      )
    ).toBeInTheDocument();

    await klikkSvarRadioknapp(
      'Har du meldt adresseendring til Folkeregisteret?',
      'Nei',
      screen,
      user
    );

    expect(
      screen.getByText((tekst) =>
        tekst.includes('Du må ha meldt adresseendring til Folkeregisteret')
      )
    ).toBeInTheDocument();
  });
});

describe('OmDegSteg, sivilstatus', () => {
  test('Rendrer spørsmål om uregistrert gift/skilt/separert dersom bruker er ugift', async () => {
    settOppMellomlagretSøknad();
    const { screen, user } = await navigerTilOmDeg();

    await klikkSvarRadioknapp('Bor du på denne adressen?', 'Ja', screen, user);

    expect(
      screen.getByRole('group', {
        name: 'Er du gift uten at det er registrert i folkeregisteret i Norge?',
      })
    ).toBeInTheDocument();

    await klikkSvarRadioknapp(
      'Er du gift uten at det er registrert i folkeregisteret i Norge?',
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

    await klikkSvarRadioknapp(
      'Er du gift uten at det er registrert i folkeregisteret i Norge?',
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
    settOppMellomlagretSøknad({ sivilstand: 'GIFT' });
    const { screen, user } = await navigerTilOmDeg();

    await klikkSvarRadioknapp('Bor du på denne adressen?', 'Ja', screen, user);

    expect(
      screen.getByRole('group', {
        name: 'Har dere søkt om separasjon, søkt om skilsmisse eller reist sak for domstolen?',
      })
    ).toBeInTheDocument();

    await klikkSvarRadioknapp(
      'Har dere søkt om separasjon, søkt om skilsmisse eller reist sak for domstolen?',
      'Nei',
      screen,
      user
    );

    expect(
      screen.getByText(
        'Når du er gift, har du ikke rett til stønad til enslig mor eller far'
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole('group', {
        name: 'Hvorfor er du alene med barn?',
      })
    ).toBeInTheDocument();

    await klikkSvarRadioknapp(
      'Har dere søkt om separasjon, søkt om skilsmisse eller reist sak for domstolen?',
      'Ja',
      screen,
      user
    );

    expect(
      screen.queryByText(
        'Når du er gift, har du ikke rett til stønad til enslig mor eller far'
      )
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole('textbox', {
        name: 'Når søkte dere eller reiste sak?',
      })
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Åpne datovelger' }));
    await user.click(screen.getByRole('button', { name: 'mandag 2' }));

    expect(
      screen.getByText(
        'Du må legge ved bekreftelse fra Statsforvalteren eller domstolen.'
      )
    );

    expect(
      screen.getByRole('group', {
        name: 'Hvorfor er du alene med barn?',
      })
    ).toBeInTheDocument();
  });

  test('Rendrer felt for årsak:samlivsbrudd med den andre forelderen, samt nestehovedspørsmål', async () => {
    settOppMellomlagretSøknad();
    const { screen, user } = await navigerTilOmDeg();

    await klikkSvarRadioknapp('Bor du på denne adressen?', 'Ja', screen, user);

    await klikkSvarRadioknapp(
      'Er du gift uten at det er registrert i folkeregisteret i Norge?',
      'Nei',
      screen,
      user
    );

    await klikkSvarRadioknapp(
      'Er du separert eller skilt uten at dette er registrert i folkeregisteret i Norge?',
      'Nei',
      screen,
      user
    );

    await klikkSvarRadioknapp(
      'Hvorfor er du alene med barn?',
      'Samlivsbrudd med den andre forelderen',
      screen,
      user
    );

    await user.click(screen.getByRole('button', { name: 'Åpne datovelger' }));
    await user.click(screen.getByRole('button', { name: 'mandag 2' }));

    expect(
      screen.getByRole('group', {
        name: 'Oppholder du og barnet/barna dere i Norge?',
      })
    );
  });

  test('Rendrer felt for årsak:samlivsbrudd med noen andre, samt neste nestehovedspørsmål', async () => {
    settOppMellomlagretSøknad();
    const { screen, user } = await navigerTilOmDeg();

    await klikkSvarRadioknapp('Bor du på denne adressen?', 'Ja', screen, user);

    await klikkSvarRadioknapp(
      'Er du gift uten at det er registrert i folkeregisteret i Norge?',
      'Nei',
      screen,
      user
    );

    await klikkSvarRadioknapp(
      'Er du separert eller skilt uten at dette er registrert i folkeregisteret i Norge?',
      'Nei',
      screen,
      user
    );

    await klikkSvarRadioknapp(
      'Hvorfor er du alene med barn?',
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

    await user.type(
      screen.getByRole('textbox', { name: 'Navn' }),
      'Ola Nordmann'
    );

    await user.type(
      screen.getByRole('textbox', {
        name: 'Fødselsnummer / d-nummer (11 siffer)',
      }),
      '1234'
    );

    expect(
      screen.getByText('Ugyldig fødselsnummer eller d-nummer')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Når flyttet dere fra hverandre?' })
    );
    expect(
      screen.getByRole('button', { name: 'Åpne datovelger' })
    ).toBeInTheDocument();

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

    await user.click(screen.getByRole('button', { name: 'Åpne datovelger' }));
    await user.click(screen.getByRole('button', { name: 'mandag 2' }));

    expect(
      screen.getByRole('group', {
        name: 'Oppholder du og barnet/barna dere i Norge?',
      })
    ).toBeInTheDocument();
  });

  test('Navn, avhuket kjennerIkkeIdent og fødselsdato skal rendre neste hovedspørsmål', async () => {
    settOppMellomlagretSøknad();
    const { screen, user } = await navigerTilOmDeg();

    await klikkSvarRadioknapp('Bor du på denne adressen?', 'Ja', screen, user);

    await klikkSvarRadioknapp(
      'Er du gift uten at det er registrert i folkeregisteret i Norge?',
      'Nei',
      screen,
      user
    );

    await klikkSvarRadioknapp(
      'Er du separert eller skilt uten at dette er registrert i folkeregisteret i Norge?',
      'Nei',
      screen,
      user
    );

    await klikkSvarRadioknapp(
      'Hvorfor er du alene med barn?',
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

    await klikkCheckbox(
      'Jeg kjenner ikke fødselsnummer / d-nummer',
      screen,
      user
    );

    await user.type(
      screen.getByRole('textbox', { name: 'Fødselsdato' }),
      '02.06.1990'
    );

    expect(screen.getByRole('textbox', { name: 'Fødselsdato' })).toHaveValue(
      '02.06.1990'
    );

    await user.type(
      screen.getByRole('textbox', { name: 'Når flyttet dere fra hverandre?' }),
      '02.06.2025'
    );

    expect(
      screen.getByRole('textbox', { name: 'Når flyttet dere fra hverandre?' })
    ).toHaveValue('02.06.2025');

    expect(
      screen.getByRole('group', {
        name: 'Oppholder du og barnet/barna dere i Norge?',
      })
    ).toBeInTheDocument();
  });

  test('Rendrer neste hovedspørsmål etter årsak:alene med barn fra fødsel', async () => {
    settOppMellomlagretSøknad();
    const { screen, user } = await navigerTilOmDeg();

    await klikkSvarRadioknapp('Bor du på denne adressen?', 'Ja', screen, user);

    await klikkSvarRadioknapp(
      'Er du gift uten at det er registrert i folkeregisteret i Norge?',
      'Nei',
      screen,
      user
    );

    await klikkSvarRadioknapp(
      'Er du separert eller skilt uten at dette er registrert i folkeregisteret i Norge?',
      'Nei',
      screen,
      user
    );

    await klikkSvarRadioknapp(
      'Hvorfor er du alene med barn?',
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
    settOppMellomlagretSøknad();
    const { screen, user } = await navigerTilOmDeg();

    await klikkSvarRadioknapp('Bor du på denne adressen?', 'Ja', screen, user);

    await klikkSvarRadioknapp(
      'Er du gift uten at det er registrert i folkeregisteret i Norge?',
      'Nei',
      screen,
      user
    );

    await klikkSvarRadioknapp(
      'Er du separert eller skilt uten at dette er registrert i folkeregisteret i Norge?',
      'Nei',
      screen,
      user
    );

    await klikkSvarRadioknapp(
      'Hvorfor er du alene med barn?',
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
    settOppMellomlagretSøknad();
    const { screen, user } = await navigerTilOmDeg();

    await klikkSvarRadioknapp('Bor du på denne adressen?', 'Ja', screen, user);

    await klikkSvarRadioknapp(
      'Er du gift uten at det er registrert i folkeregisteret i Norge?',
      'Nei',
      screen,
      user
    );

    await klikkSvarRadioknapp(
      'Er du separert eller skilt uten at dette er registrert i folkeregisteret i Norge?',
      'Nei',
      screen,
      user
    );

    await klikkSvarRadioknapp(
      'Hvorfor er du alene med barn?',
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

    expect(
      screen.getByRole('link', { name: 'gjenlevende' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'barnepensjon' })
    ).toBeInTheDocument();

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
  test('Rendrer neste spm dersom bruker oppholder seg i Norge', async () => {
    settOppMellomlagretSøknad();
    const { screen, user } = await navigerTilOmDeg();

    await klikkSvarRadioknapp('Bor du på denne adressen?', 'Ja', screen, user);
    await klikkSvarRadioknapp(
      'Er du gift uten at det er registrert i folkeregisteret i Norge?',
      'Nei',
      screen,
      user
    );
    await klikkSvarRadioknapp(
      'Er du separert eller skilt uten at dette er registrert i folkeregisteret i Norge?',
      'Nei',
      screen,
      user
    );
    await klikkSvarRadioknapp(
      'Hvorfor er du alene med barn?',
      'Jeg er alene med barn på grunn av dødsfall',
      screen,
      user
    );

    await klikkSvarRadioknapp(
      'Oppholder du og barnet/barna dere i Norge?',
      'Ja',
      screen,
      user
    );

    expect(
      screen.getByRole('group', {
        name: 'Har du oppholdt deg i Norge de siste 5 årene?',
      })
    ).toBeInTheDocument();
  });

  test('Rendrer felt og neste spm, dersom bruker ikke oppholder seg i Norge', async () => {
    settOppMellomlagretSøknad();
    const { screen, user } = await navigerTilOmDeg();

    await klikkSvarRadioknapp('Bor du på denne adressen?', 'Ja', screen, user);
    await klikkSvarRadioknapp(
      'Er du gift uten at det er registrert i folkeregisteret i Norge?',
      'Nei',
      screen,
      user
    );
    await klikkSvarRadioknapp(
      'Er du separert eller skilt uten at dette er registrert i folkeregisteret i Norge?',
      'Nei',
      screen,
      user
    );
    await klikkSvarRadioknapp(
      'Hvorfor er du alene med barn?',
      'Jeg er alene med barn på grunn av dødsfall',
      screen,
      user
    );

    await klikkSvarRadioknapp(
      'Oppholder du og barnet/barna dere i Norge?',
      'Nei',
      screen,
      user
    );

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
    settOppMellomlagretSøknad();
    const { screen, user } = await navigerTilOmDeg();

    await klikkSvarRadioknapp('Bor du på denne adressen?', 'Ja', screen, user);
    await klikkSvarRadioknapp(
      'Er du gift uten at det er registrert i folkeregisteret i Norge?',
      'Nei',
      screen,
      user
    );
    await klikkSvarRadioknapp(
      'Er du separert eller skilt uten at dette er registrert i folkeregisteret i Norge?',
      'Nei',
      screen,
      user
    );
    await klikkSvarRadioknapp(
      'Hvorfor er du alene med barn?',
      'Jeg er alene med barn på grunn av dødsfall',
      screen,
      user
    );

    await klikkSvarRadioknapp(
      'Oppholder du og barnet/barna dere i Norge?',
      'Ja',
      screen,
      user
    );

    await klikkSvarRadioknapp(
      'Har du oppholdt deg i Norge de siste 5 årene?',
      'Ja',
      screen,
      user
    );

    expect(screen.getByRole('button', { name: 'Neste' }));
  });

  test('Rendrer felter og neste-steg knapp, dersom bruker ikke har oppholdt seg i Norge siste 5 år (IKKE EØS)', async () => {
    settOppMellomlagretSøknad();
    const { screen, user } = await navigerTilOmDeg();

    await klikkSvarRadioknapp('Bor du på denne adressen?', 'Ja', screen, user);
    await klikkSvarRadioknapp(
      'Er du gift uten at det er registrert i folkeregisteret i Norge?',
      'Nei',
      screen,
      user
    );
    await klikkSvarRadioknapp(
      'Er du separert eller skilt uten at dette er registrert i folkeregisteret i Norge?',
      'Nei',
      screen,
      user
    );
    await klikkSvarRadioknapp(
      'Hvorfor er du alene med barn?',
      'Jeg er alene med barn på grunn av dødsfall',
      screen,
      user
    );

    await klikkSvarRadioknapp(
      'Oppholder du og barnet/barna dere i Norge?',
      'Ja',
      screen,
      user
    );

    await klikkSvarRadioknapp(
      'Har du oppholdt deg i Norge de siste 5 årene?',
      'Nei',
      screen,
      user
    );

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

    expect(
      screen.getByText('Har du hatt flere utenlandsopphold de siste 5 årene?')
    );

    expect(
      screen.getByRole('button', { name: 'Legg til et utenlandsopphold' })
    );

    expect(screen.getByRole('button', { name: 'Neste' }));
  });

  test('Rendrer felter og neste-steg knapp, dersom bruker ikke har oppholdt seg i Norge siste 5 år (EØS)', async () => {
    settOppMellomlagretSøknad();
    const { screen, user } = await navigerTilOmDeg();

    await klikkSvarRadioknapp('Bor du på denne adressen?', 'Ja', screen, user);
    await klikkSvarRadioknapp(
      'Er du gift uten at det er registrert i folkeregisteret i Norge?',
      'Nei',
      screen,
      user
    );
    await klikkSvarRadioknapp(
      'Er du separert eller skilt uten at dette er registrert i folkeregisteret i Norge?',
      'Nei',
      screen,
      user
    );
    await klikkSvarRadioknapp(
      'Hvorfor er du alene med barn?',
      'Jeg er alene med barn på grunn av dødsfall',
      screen,
      user
    );

    await klikkSvarRadioknapp(
      'Oppholder du og barnet/barna dere i Norge?',
      'Ja',
      screen,
      user
    );

    await klikkSvarRadioknapp(
      'Har du oppholdt deg i Norge de siste 5 årene?',
      'Nei',
      screen,
      user
    );

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

    expect(
      screen.getByText('Har du hatt flere utenlandsopphold de siste 5 årene?')
    );

    expect(
      screen.getByRole('button', { name: 'Legg til et utenlandsopphold' })
    );

    expect(screen.getByRole('button', { name: 'Neste' }));
  });
});
