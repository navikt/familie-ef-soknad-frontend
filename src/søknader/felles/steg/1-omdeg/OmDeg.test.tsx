import { describe, expect, test, vi } from 'vitest';
import { mockGet, settOppMellomlagretSøknad } from '../../../../test/axios';
import {
  forventFelt,
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

    expect(
      screen.getByRole('group', { name: 'Hvorfor er du alene med barn?' })
    );

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

  test('Rendrer riktige felt for årsak:samlivsbrudd med den andre forelderen, samt neste spørsmål (medlemskap)', async () => {
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

  test('Rendrer riktige felt for årsak:samlivsbrudd med noen andre, samt neste spørsmål (medlemskap)', async () => {
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

  test('Navn, avhuket kjennerIkkeIdent og fødselsdato skal rendre neste spørsmål', async () => {
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

    forventFelt('textbox', 'Navn', screen);
    forventFelt('textbox', 'Fødselsnummer / d-nummer (11 siffer)', screen);
    forventFelt(
      'checkbox',
      'Jeg kjenner ikke fødselsnummer / d-nummer',
      screen
    );

    await skrivFritekst('Navn', 'Ola Nordmann', screen, user);

    await klikkCheckbox(
      'Jeg kjenner ikke fødselsnummer / d-nummer',
      screen,
      user
    );

    //Se om dette kan gjøres ryddigere

    await user.click(
      screen.getByRole('button', {
        name: 'Åpne datovelger',
      })
    );
    await user.click(screen.getByRole('button', { name: 'mandag 2' }));
    expect(screen.getByRole('textbox', { name: 'Fødselsdato' })).toHaveValue(
      '02.06.2025'
    );

    const datoVelgere = screen.getAllByRole('button', {
      name: 'Åpne datovelger',
    });

    await user.click(datoVelgere[1]);
    await user.click(screen.getByRole('button', { name: 'mandag 2' }));

    forventFelt('group', 'Oppholder du og barnet/barna dere i Norge?', screen);
  });
});
