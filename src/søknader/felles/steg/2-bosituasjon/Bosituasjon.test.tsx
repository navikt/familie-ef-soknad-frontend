import { describe, expect, vi } from 'vitest';
import { mockGet, mockMellomlagretSøknad, mockPost } from '../../../../test/axios';
import {
  klikkCheckbox,
  klikkRadioknapp,
  navigerTilSteg,
  skrivFritekst,
} from '../../../../test/actions';

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
    mockMellomlagretSøknad('overgangsstonad', '/bosituasjon');
    const { screen } = await navigerTilSteg();

    expect(
      screen.getByRole('heading', { level: 2, name: 'Bosituasjonen din' })
    ).toBeInTheDocument();
    expect(screen.getByText('Barna dine')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tilbake' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Avbryt' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Neste' })).not.toBeInTheDocument();
  });

  test('Bruker bor sammen med en hen har eller venter barn med', async () => {
    mockMellomlagretSøknad('overgangsstonad', '/bosituasjon');
    const { screen, user } = await navigerTilSteg();

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
    mockMellomlagretSøknad('overgangsstonad', '/bosituasjon');
    const { screen, user } = await navigerTilSteg();

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
    mockMellomlagretSøknad('overgangsstonad', '/bosituasjon');
    const { screen, user } = await navigerTilSteg();

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
});
