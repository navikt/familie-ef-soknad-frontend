import { describe, expect, vi } from 'vitest';
import { mockGet, mockMellomlagretSøknadOvergangsstønad, mockPost } from '../../../../test/axios';
import {
  klikkCheckbox,
  klikkKomponentMedId,
  klikkRadioknapp,
  navigerTilStegOvergangsstønad,
  skrivFritekst,
  skrivFritekstTilKomponentMedId,
} from '../../../../test/aksjoner';
import { datoEnMånedFrem, datoEnMånedTilbake } from '../../../../test/dato';

vi.mock('axios', () => {
  return {
    default: {
      get: vi.fn((url: string) => mockGet(url, 'overgangsstonad')),
      post: vi.fn((url: string) => mockPost(url, 'overgangsstonad')),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    },
  };
});

describe('BosituasjonSteg', () => {
  test('Skal navigere til bosituasjonsteg fra mellomlagret søknad', async () => {
    mockMellomlagretSøknadOvergangsstønad('/bosituasjon');
    const { screen } = await navigerTilStegOvergangsstønad();

    expect(
      screen.getByRole('heading', { level: 2, name: 'Bosituasjonen din' })
    ).toBeInTheDocument();
    expect(screen.getByText('Barna dine')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tilbake' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Avbryt' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
  });

  test('Bruker bor sammen med en hen har eller venter barn med', async () => {
    mockMellomlagretSøknadOvergangsstønad('/bosituasjon');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    expect(
      screen.queryByText(
        'Når du bor sammen med en du har eller venter barn med, har du ikke rett til stønad til enslig mor eller far'
      )
    ).not.toBeInTheDocument();
    await klikkRadioknapp(
      'Deler du bolig med andre voksne?',
      'Ja, jeg bor sammen med en jeg har eller venter barn med',
      screen,
      user
    );
    expect(
      screen.getByText(
        'Når du bor sammen med en du har eller venter barn med, har du ikke rett til stønad til enslig mor eller far'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();

    expect(screen.queryByRole('heading', { level: 2, name: 'Barna dine' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Neste' }));
    expect(screen.getByRole('heading', { level: 2, name: 'Barna dine' })).toBeInTheDocument();
  });

  test('Bruker og den andre forelderen bor midlertidig fra hverandre', async () => {
    mockMellomlagretSøknadOvergangsstønad('/bosituasjon');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    expect(
      screen.queryByText(
        'Når dere bor midlertidig fra hverandre, har du ikke rett til stønad til enslig mor eller far.'
      )
    ).not.toBeInTheDocument();
    await klikkRadioknapp(
      'Deler du bolig med andre voksne?',
      'Ja, men jeg og den andre forelderen bor midlertidig fra hverandre',
      screen,
      user
    );
    expect(
      screen.getByText(
        'Når dere bor midlertidig fra hverandre, har du ikke rett til stønad til enslig mor eller far.'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();

    expect(screen.queryByRole('heading', { level: 2, name: 'Barna dine' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Neste' }));
    expect(screen.getByRole('heading', { level: 2, name: 'Barna dine' })).toBeInTheDocument();
  });

  test('Bruker bor sammen med kjæresten sin', async () => {
    mockMellomlagretSøknadOvergangsstønad('/bosituasjon');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    expect(
      screen.queryByText('Når du har samboer, har du ikke rett til stønad til enslig mor eller far')
    ).not.toBeInTheDocument();
    await klikkRadioknapp(
      'Deler du bolig med andre voksne?',
      'Ja, jeg bor med kjæresten min',
      screen,
      user
    );
    expect(
      screen.getByText('Når du har samboer, har du ikke rett til stønad til enslig mor eller far')
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();

    expect(
      screen.queryByRole('textbox', { name: 'Fødselsnummer / d-nummer (11 siffer)' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('checkbox', { name: 'Jeg kjenner ikke fødselsnummer / d-nummer' })
    ).not.toBeInTheDocument();
    await skrivFritekst('Navn', 'Kari Nordmann', screen, user);
    expect(
      screen.getByRole('textbox', { name: 'Fødselsnummer / d-nummer (11 siffer)' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Jeg kjenner ikke fødselsnummer / d-nummer' })
    ).not.toBeChecked();

    expect(
      screen.queryByRole('textbox', { name: 'Når flyttet dere sammen?' })
    ).not.toBeInTheDocument();
    await skrivFritekst('Fødselsnummer / d-nummer (11 siffer)', '27909698168', screen, user);
    expect(screen.getByRole('textbox', { name: 'Når flyttet dere sammen?' })).toBeInTheDocument();

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    await skrivFritekst('Når flyttet dere sammen?', '01.06.2025', screen, user);
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();

    expect(screen.queryByRole('textbox', { name: 'Fødselsdato' })).not.toBeInTheDocument();
    await klikkCheckbox('Jeg kjenner ikke fødselsnummer / d-nummer', screen, user);
    expect(
      screen.getByRole('textbox', { name: 'Fødselsnummer / d-nummer (11 siffer)' })
    ).toBeDisabled();
    expect(
      screen.getByRole('textbox', { name: 'Fødselsnummer / d-nummer (11 siffer)' })
    ).toHaveValue('');
    expect(
      screen.getByRole('checkbox', { name: 'Jeg kjenner ikke fødselsnummer / d-nummer' })
    ).toBeChecked();
    expect(screen.getByRole('textbox', { name: 'Fødselsdato' })).toBeInTheDocument();

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(
      screen.queryByRole('textbox', { name: 'Når flyttet dere sammen?' })
    ).not.toBeInTheDocument();
    await skrivFritekst('Fødselsdato', '24.02.1995', screen, user);
    expect(screen.getByRole('textbox', { name: 'Når flyttet dere sammen?' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Når flyttet dere sammen?' })).toHaveValue(
      '01.06.2025'
    );
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();

    expect(screen.queryByRole('heading', { level: 2, name: 'Barna dine' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Neste' }));
    expect(screen.getByRole('heading', { level: 2, name: 'Barna dine' })).toBeInTheDocument();
  });

  test('Bruker deler bolig med andre voksne', async () => {
    mockMellomlagretSøknadOvergangsstønad('/bosituasjon');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    expect(
      screen.queryByRole('group', {
        name: 'Har du konkrete planer om å gifte deg eller bli samboer?',
      })
    ).not.toBeInTheDocument();
    await klikkRadioknapp(
      'Deler du bolig med andre voksne?',
      'Ja, jeg deler bolig med andre voksne, for eksempel utleier, venn, søsken eller egne foreldre',
      screen,
      user
    );
    expect(
      screen.getByRole('group', {
        name: 'Har du konkrete planer om å gifte deg eller bli samboer?',
      })
    ).toBeInTheDocument();

    expect(screen.queryByRole('textbox', { name: 'Når skal dette skje?' })).not.toBeInTheDocument();
    await klikkRadioknapp(
      'Har du konkrete planer om å gifte deg eller bli samboer?',
      'Ja',
      screen,
      user
    );
    expect(screen.getByRole('textbox', { name: 'Når skal dette skje?' })).toBeInTheDocument();

    expect(screen.queryByRole('textbox', { name: 'Navn' })).not.toBeInTheDocument();
    await skrivFritekst('Når skal dette skje?', '10.02.2030', screen, user);
    expect(screen.getByRole('textbox', { name: 'Navn' })).toBeInTheDocument();

    expect(
      screen.queryByRole('textbox', { name: 'Fødselsnummer / d-nummer (11 siffer)' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('checkbox', { name: 'Jeg kjenner ikke fødselsnummer / d-nummer' })
    ).not.toBeInTheDocument();
    await skrivFritekst('Navn', 'Kari Nordmann', screen, user);
    expect(
      screen.getByRole('textbox', { name: 'Fødselsnummer / d-nummer (11 siffer)' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Jeg kjenner ikke fødselsnummer / d-nummer' })
    ).not.toBeChecked();

    expect(screen.queryByRole('textbox', { name: 'Fødselsdato' })).not.toBeInTheDocument();
    await klikkCheckbox('Jeg kjenner ikke fødselsnummer / d-nummer', screen, user);
    expect(
      screen.getByRole('textbox', { name: 'Fødselsnummer / d-nummer (11 siffer)' })
    ).toBeDisabled();
    expect(screen.getByRole('textbox', { name: 'Fødselsdato' })).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Jeg kjenner ikke fødselsnummer / d-nummer' })
    ).toBeChecked();

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    await skrivFritekst('Fødselsdato', '24.02.1995', screen, user);
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();

    await klikkCheckbox('Jeg kjenner ikke fødselsnummer / d-nummer', screen, user);
    expect(
      screen.getByRole('checkbox', { name: 'Jeg kjenner ikke fødselsnummer / d-nummer' })
    ).not.toBeChecked();
    expect(
      screen.getByRole('textbox', { name: 'Fødselsnummer / d-nummer (11 siffer)' })
    ).not.toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();

    await skrivFritekst('Fødselsnummer / d-nummer (11 siffer)', '27909698168', screen, user);
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();

    expect(screen.queryByRole('heading', { level: 2, name: 'Barna dine' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Neste' }));
    expect(screen.getByRole('heading', { level: 2, name: 'Barna dine' })).toBeInTheDocument();
  });

  test('Bruker har tidligere samboer registrert på adressen sin', async () => {
    mockMellomlagretSøknadOvergangsstønad('/bosituasjon');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    expect(
      screen.queryByText(
        'Vi legger vekt på folkeregistrert adresse. Hvis den tidligere samboeren din ikke samarbeider om adresseendring, kan du kontakte Folkeregisteret for å få hjelp til å endre adressen deres.'
      )
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: 'Navn' })).not.toBeInTheDocument();
    await klikkRadioknapp(
      'Deler du bolig med andre voksne?',
      'Nei, men en tidligere samboer er fortsatt registrert på adressen min',
      screen,
      user
    );
    expect(
      screen.queryByText(
        'Vi legger vekt på folkeregistrert adresse. Hvis den tidligere samboeren din ikke samarbeider om adresseendring, kan du kontakte Folkeregisteret for å få hjelp til å endre adressen deres.'
      )
    ).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Navn' })).toBeInTheDocument();

    expect(
      screen.queryByRole('textbox', { name: 'Fødselsnummer / d-nummer (11 siffer)' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('checkbox', { name: 'Jeg kjenner ikke fødselsnummer / d-nummer' })
    ).not.toBeInTheDocument();
    await skrivFritekst('Navn', 'Kari Nordmann', screen, user);
    expect(
      screen.getByRole('textbox', { name: 'Fødselsnummer / d-nummer (11 siffer)' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Jeg kjenner ikke fødselsnummer / d-nummer' })
    ).not.toBeChecked();

    expect(
      screen.queryByRole('textbox', { name: 'Når flyttet dere fra hverandre?' })
    ).not.toBeInTheDocument();
    await skrivFritekst('Fødselsnummer / d-nummer (11 siffer)', '27909698168', screen, user);
    expect(
      screen.getByRole('textbox', { name: 'Når flyttet dere fra hverandre?' })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('group', {
        name: 'Har du konkrete planer om å gifte deg eller bli samboer?',
      })
    ).not.toBeInTheDocument();
    await skrivFritekst('Når flyttet dere fra hverandre?', '01.06.2025', screen, user);
    expect(
      screen.getByRole('group', {
        name: 'Har du konkrete planer om å gifte deg eller bli samboer?',
      })
    ).toBeInTheDocument();

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    await klikkRadioknapp(
      'Har du konkrete planer om å gifte deg eller bli samboer?',
      'Nei',
      screen,
      user
    );
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();

    expect(screen.queryByRole('textbox', { name: 'Når skal dette skje?' })).not.toBeInTheDocument();
    await klikkRadioknapp(
      'Har du konkrete planer om å gifte deg eller bli samboer?',
      'Ja',
      screen,
      user
    );
    expect(screen.getByRole('textbox', { name: 'Når skal dette skje?' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();

    expect(screen.queryByTestId('bosituasjon-skal-gifte-seg-navn')).not.toBeInTheDocument();
    await skrivFritekst('Når skal dette skje?', datoEnMånedFrem, screen, user);
    expect(screen.getByTestId('bosituasjon-skal-gifte-seg-navn')).toBeInTheDocument();

    expect(
      screen.queryByTestId('bosituasjon-skal-gifte-seg-fødselsnummer')
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('bositasjon-skal-gifte-seg-checkbox')).not.toBeInTheDocument();
    await skrivFritekstTilKomponentMedId(
      'bosituasjon-skal-gifte-seg-navn',
      'Guri Nordmann',
      screen,
      user
    );
    expect(screen.getByTestId('bosituasjon-skal-gifte-seg-fødselsnummer')).toBeInTheDocument();
    expect(screen.getByTestId('bosituasjon-skal-gifte-seg-checkbox')).toBeInTheDocument();

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    await skrivFritekstTilKomponentMedId(
      'bosituasjon-skal-gifte-seg-fødselsnummer',
      '27909698168',
      screen,
      user
    );
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();

    expect(screen.queryByTestId('bosituasjon-skal-gifte-seg-fødselsdato')).not.toBeInTheDocument();
    await klikkKomponentMedId('bosituasjon-skal-gifte-seg-checkbox', screen, user);
    expect(screen.getByTestId('bosituasjon-skal-gifte-seg-fødselsdato')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(screen.getByTestId('bosituasjon-skal-gifte-seg-fødselsnummer')).toBeDisabled();
    expect(screen.getByTestId('bosituasjon-skal-gifte-seg-checkbox')).toBeChecked();
    await skrivFritekstTilKomponentMedId(
      'bosituasjon-skal-gifte-seg-fødselsdato',
      datoEnMånedTilbake,
      screen,
      user
    );
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();

    await klikkKomponentMedId('bosituasjon-tidligere-samboer-checkbox', screen, user);
    expect(screen.getByTestId('bosituasjon-tidligere-samboer-checkbox')).toBeChecked();
    expect(screen.getByTestId('bosituasjon-tidligere-samboer-fødselsnummer')).toBeDisabled();
    expect(
      screen.getByRole('textbox', { name: 'Fødselsdato (kun hvis du vet)' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();

    await klikkKomponentMedId('bosituasjon-tidligere-samboer-checkbox', screen, user);
    expect(screen.getByTestId('bosituasjon-tidligere-samboer-checkbox')).not.toBeChecked();
    expect(screen.getByTestId('bosituasjon-tidligere-samboer-fødselsnummer')).toBeEnabled();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();

    await klikkKomponentMedId('bosituasjon-tidligere-samboer-checkbox', screen, user);
    expect(screen.getByTestId('bosituasjon-tidligere-samboer-checkbox')).toBeChecked();
    expect(screen.getByTestId('bosituasjon-tidligere-samboer-fødselsnummer')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();

    expect(screen.queryByRole('heading', { level: 2, name: 'Barna dine' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Neste' }));
    expect(screen.getByRole('heading', { level: 2, name: 'Barna dine' })).toBeInTheDocument();
  }, 10000);

  test('Bruker bor alene med barn eller er gravid og bor alene', async () => {
    mockMellomlagretSøknadOvergangsstønad('/bosituasjon');
    const { screen, user } = await navigerTilStegOvergangsstønad();

    expect(
      screen.queryByRole('group', {
        name: 'Har du konkrete planer om å gifte deg eller bli samboer?',
      })
    ).not.toBeInTheDocument();
    await klikkRadioknapp(
      'Deler du bolig med andre voksne?',
      'Nei, jeg bor alene med barn eller jeg er gravid og bor alene',
      screen,
      user
    );
    expect(
      screen.getByRole('group', {
        name: 'Har du konkrete planer om å gifte deg eller bli samboer?',
      })
    ).toBeInTheDocument();

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    await klikkRadioknapp(
      'Har du konkrete planer om å gifte deg eller bli samboer?',
      'Nei',
      screen,
      user
    );
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();

    expect(screen.queryByRole('textbox', { name: 'Når skal dette skje?' })).not.toBeInTheDocument();
    await klikkRadioknapp(
      'Har du konkrete planer om å gifte deg eller bli samboer?',
      'Ja',
      screen,
      user
    );
    expect(screen.getByRole('textbox', { name: 'Når skal dette skje?' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();

    expect(screen.queryByRole('textbox', { name: 'Navn' })).not.toBeInTheDocument();
    await skrivFritekst('Når skal dette skje?', datoEnMånedFrem, screen, user);
    expect(screen.getByRole('textbox', { name: 'Navn' })).toBeInTheDocument();

    expect(
      screen.queryByRole('textbox', { name: 'Fødselsnummer / d-nummer (11 siffer)' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('checkbox', { name: 'Jeg kjenner ikke fødselsnummer / d-nummer' })
    ).not.toBeInTheDocument();
    await skrivFritekst('Navn', 'Kari Nordmann', screen, user);
    expect(
      screen.getByRole('textbox', { name: 'Fødselsnummer / d-nummer (11 siffer)' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Jeg kjenner ikke fødselsnummer / d-nummer' })
    ).not.toBeChecked();

    expect(screen.queryByRole('textbox', { name: 'Fødselsdato' })).not.toBeInTheDocument();
    await klikkCheckbox('Jeg kjenner ikke fødselsnummer / d-nummer', screen, user);
    expect(
      screen.getByRole('textbox', { name: 'Fødselsnummer / d-nummer (11 siffer)' })
    ).toBeDisabled();
    expect(
      screen.getByRole('textbox', { name: 'Fødselsnummer / d-nummer (11 siffer)' })
    ).toHaveValue('');
    expect(screen.getByRole('textbox', { name: 'Fødselsdato' })).toBeInTheDocument();

    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    await skrivFritekst('Fødselsdato', datoEnMånedTilbake, screen, user);
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();

    await klikkCheckbox('Jeg kjenner ikke fødselsnummer / d-nummer', screen, user);
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Fødselsnummer / d-nummer (11 siffer)' })
    ).not.toBeDisabled();
    expect(
      screen.getByRole('textbox', { name: 'Fødselsnummer / d-nummer (11 siffer)' })
    ).toHaveValue('');
    expect(
      screen.getByRole('checkbox', { name: 'Jeg kjenner ikke fødselsnummer / d-nummer' })
    ).not.toBeChecked();

    await skrivFritekst('Fødselsnummer / d-nummer (11 siffer)', '27909698168', screen, user);
    expect(screen.getByRole('button', { name: 'Neste' })).toBeInTheDocument();

    expect(screen.queryByRole('heading', { level: 2, name: 'Barna dine' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Neste' }));
    expect(screen.getByRole('heading', { level: 2, name: 'Barna dine' })).toBeInTheDocument();
  });
});
